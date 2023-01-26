import React, { useState, useEffect } from "react";
import { Divider, Button, List, Checkbox, Input, Table, message , Typography} from "antd";
import { useRecoilState } from "recoil";
import { pdfListAtom } from "../store/atom";
import { useNavigate, useRouter } from "react-router-dom";
import axios from "axios"
const { Link } = Typography




const columns = [
  {
    key: 1,
    title: "Name",
    name: "name",
    dataIndex: "name",
  },
  {
    key: 2,
    title: "fileSize",
    name: "fileSize",
    dataIndex: "fileSize",
  },
  {
    key: 3,
    title: "date",
    dataIndex: "date",
    // render: text=><span>{text}</span>
  },
  {
    key: 4,
    title: "download",
    dataIndex: "download",
    onCell: (record, rowIndex) => {
      return {
        onClick: async () => {
          console.log(record, rowIndex);
          const downloadResponse = await axios.post(
            "https://bizfund-exceltopdf.herokuapp.com/api/file/get_temporary_link",
            {
              fileId: record.download
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          if (downloadResponse) {
            console.log("downloadResponse", downloadResponse?.data?.link)
            var hiddenElement = document.createElement("a");
            hiddenElement.setAttribute("id", " " + Math.random());
            hiddenElement.href = downloadResponse?.data?.link;
            hiddenElement.setAttribute('target', '_blank');
            console.log("hiddenElement", hiddenElement);
          hiddenElement.click();
          }


      
        },
      };
    },
    // render: text=><span>{text}</span>
    // render: text=><Link to={text} target="_blank">{text}</Link>
  },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]) 
  const [listFiles, setListFiles] = useRecoilState(pdfListAtom);
  const [data, setData] = useState([]);


  useEffect(() => {
    console.log("listFiles", listFiles)
    const d = new Date();
    if (listFiles.length === 0) {
      message.error("The uploaded Files for comparison are missing");
      setTimeout(() => {
       navigate("/");
      }, 1000);
    } else {
      const finalData = listFiles.map((list,i) =>{ 
       return {
        key: i,
      name: "Sample File",
      fileSize: '200 KB',
      date: d.toString(),
      download: list.fileId,

       }

      })
      console.log("finalData", finalData)
      setData(finalData)
    }
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedKeys(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
   
  };


  const downloadHandler = async () =>{
     console.log("selectedKeys", selectedKeys)
  const downloadRows =  selectedKeys.map((row) => row.download)
  console.log("downloadRows", downloadRows);
  const downloadResponse = await axios.post(
    "https://bizfund-exceltopdf.herokuapp.com/api/file/get_temporary_links",
    {
      fileIds: downloadRows
    },
    {
      headers: {
        "Content-Type": "application/json"
      },
    }
  )
  if (downloadResponse) {

    console.log("downloadResponse", downloadResponse.data)
    downloadResponse.data.map((res) =>{
    console.log("resss", res.link)
        var hiddenElement = document.createElement("a");
    hiddenElement.setAttribute("id", " " + Math.random());
    hiddenElement.href = res?.link;
    hiddenElement.setAttribute('target', '_blank');
    console.log("hiddenElement", hiddenElement);
     hiddenElement.click();
    })

  }
  
  } 

  return (
    <div className="upload-page-container">
      <a href="/">
        <Button className="btn">Back</Button>
      </a>

      <div className="upload-header">
        <div>
          <h1>Uploaded Files</h1>
          <p>You can access your PDFs document here.</p>
        </div>
        <div>
          <Button className="btn" type="primary" onClick={downloadHandler}>
            Download Selected
          </Button>
          <Button className="btn done" type="primary">
            Delete
          </Button>
        </div>
      </div>

      <div className="list-container">
        <Input placeholder="Search" className="input-search" />
        <Divider />
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          // onRow={record => ({
          //     onClick: e => {
          //       /* Call some endPoint to log this click event */
          //       console.log(`user clicked on row ${record.age}!`);
          //     }
          //   })}
        />
 
      </div>
    </div>
  );
};

export default UploadPage;
