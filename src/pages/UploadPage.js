import React, { useState, useEffect } from "react";
import { Divider, Button, List, Checkbox, Input, Table, message , Typography , Spin} from "antd";
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
          try {
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
          } catch (error) {
            console.log("error", error)
            message.error(error.response.data.message)
          }
       
        },
      };
    },
     render: text=><span className="myLink">{text}</span>
    // render: text=><Link to={text} target="_blank">{text}</Link>
  },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]) 
  const [listFiles, setListFiles] = useRecoilState(pdfListAtom);
  const [loading,setLoading] = useState(false)
  // const [filteredFiles,setFilteredFiles]= useState([])
  const [data, setData] = useState([]);


  useEffect(() => {
    console.log("listFiles", listFiles)

    const d = new Date();
    if (listFiles.length === 0) {
      message.error("Pdf Files are missing");
      setTimeout(() => {
       navigate("/");
      }, 1000);
    } else {
      const finalData = listFiles.map((list,i) =>{ 
       return {
        key: i,
      name: list.fileId.split("/")[1],
      fileSize: '200 KB',
      date: d.toISOString().split('T')[0],
      download: list.fileId,
       }
      })
      console.log("finalData", finalData)
      // setFilteredFiles(finalData)
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

  const downloadZipHandler = async () =>{
    console.log("selectedKeys", selectedKeys)
    if (selectedKeys.length === 0) {
     return message.error("Please select a file")      
    }
    const downloadRows =  selectedKeys.map((row) => row.download)
    console.log("downloadRows", downloadRows);
    setLoading(true);

    try {
      
    const zipResponse = await axios.post(
      "https://bizfund-exceltopdf.herokuapp.com/api/file/downloadZip",
      {
        fileIds: downloadRows
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    )
    if (zipResponse) {
      console.log("zipResponse", zipResponse.data)
      try {
        const downloadResponse = await axios.post(
          "https://bizfund-exceltopdf.herokuapp.com/api/file/get_temporary_link",
          {
            fileId: zipResponse.data.link
          },
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        )
       if(downloadResponse){
        console.log("downloadResponse", downloadResponse)
        var hiddenElement = document.createElement("a");
        hiddenElement.setAttribute("id", " " + Math.random());
        hiddenElement.href = downloadResponse.data?.link;
        hiddenElement.setAttribute('target', '_blank');
        console.log("hiddenElement", hiddenElement);
         hiddenElement.click();
       }
      } catch (error) {
        console.log("error", error)
        message.error(error.response.data.message)
      }
    }
    } catch (error) {
      console.log("error", error)
      message.error(error.response.data.message)
    }
    setLoading(false);
  }


  const downloadHandler = async () =>{
     console.log("selectedKeys", selectedKeys)
     if (selectedKeys.length === 0) {
      return message.error("Please select a file")      
     }
  const downloadRows =  selectedKeys.map((row) => row.download)
  console.log("downloadRows", downloadRows);
  try {
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
      downloadResponse.data.map((res) => {
      console.log("resss", res.link)
          var hiddenElement = document.createElement("a");
      hiddenElement.setAttribute("id", " " + Math.random());
      hiddenElement.href = res?.link;
      hiddenElement.setAttribute('target', '_blank');
      console.log("hiddenElement", hiddenElement);
       hiddenElement.click();
      })
  
    } 
  } catch (error) {
    console.log("error", error)
    message.error(error.response.data.message)
  }

  
  } 

  const deleteHandler = () =>{
    console.log("selectedKeys", selectedKeys)
    const d = new Date();
    if (selectedKeys.length === 0) {
    return message.error("Please select a file to delete");     
    }
    console.log("listFiles", listFiles);

    const newArr = selectedKeys.map(ar => ar.download);

    console.log("newArr", newArr)
    const myArrayFiltered = listFiles.filter(file => !newArr.includes(file.fileId));
    
    console.log("myArrayFiltered", myArrayFiltered);

    const finalData = myArrayFiltered.map((list,i) =>{ 
      return {
       key: i,
     name: list.fileId.split("-")[0],
     fileSize: '200 KB',
     date: d.toISOString().split('T')[0],
     download: list.fileId,
      }
     })
     console.log("finalData", finalData)
     // setFilteredFiles(finalData)
     setData(finalData)

  }

  const onChange = (e) =>{
    const d = new Date();
    console.log("value", e.target.value)
    console.log("filtered", listFiles);
    const excelFiles = [...listFiles];
    const filteredFiles = excelFiles.filter((file) => file.fileId.includes(e.target.value));
    console.log("filteredFiles", filteredFiles);
    const finalData = filteredFiles.map((list,i) =>{ 
      return {
       key: i,
     name: list.fileId.split("-")[0],
     fileSize: '200 KB',
     date: d.toISOString().split('T')[0],
     download: list.fileId,
      }
     })
     console.log("finalData", finalData)
     // setFilteredFiles(finalData)
     setData(finalData)

  }

  return (
    <div className="upload-page-container">
        <Spin spinning={loading}>
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
          <Button className="btn done" type="primary" onClick={deleteHandler}>
            Delete Selected
          </Button>
          <Button className="btn" type="primary" onClick={downloadZipHandler}>
            Download Zip
          </Button>
        </div>
      </div>

      <div className="list-container">
        <Input placeholder="Search" className="input-search" onChange={onChange}/>
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
      </Spin>
    </div>
  );
};

export default UploadPage;
