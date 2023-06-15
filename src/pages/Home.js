import React, { useState } from "react";
import { useNavigate, useRouter } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

import { message, Upload, Button, Spin } from "antd";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useRecoilState } from "recoil";
import { pdfListAtom } from "../store/atom";

const { Dragger } = Upload;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUploadImage = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const Home = () => {
  const navigate = useNavigate();
  const [imageInfo, setImageInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useRecoilState(pdfListAtom);

  const onDrop = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("image here", info.file, info.fileList);
    }
    if (status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        // console.log("url", url);
        setImageInfo(url);
        message.success("Image Uploaded");
      });
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const onChangeImage = async (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("image here", info.file, info.fileList);
    }
    if (status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        // console.log("url", url);
        setImageInfo(url);
        message.success("Image Uploaded");
      });
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles[0]", acceptedFiles[0]);
      if (
        acceptedFiles[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(acceptedFiles[0]);
        message.success("Excel uploaded Successfully");
   
      } else {
        message.error("Please upload valid File");
      }
    },
  });

  const submitHandler = async () => {
    if (file === null) {
      return message.error("Please upload the excel file");
    } else {
      try {
        setUploading(true);
        const formData = new FormData();
        console.log("file append", file);
        formData.append("excel", file);
        // formData.append("esignature", imageInfo)
        const apiResponse = await axios.post(
          "https://infinite-waters-75444-dacdc86dadc2.herokuapp.com/api/file/excelToPDF",
          {
            excel: file,
            esignature: imageInfo ? imageInfo : "",
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (apiResponse) {
          console.log("apiResponse", apiResponse);
          setFilesList(apiResponse?.data);
          setUploading(false);
          message.success("Pdf Generated");
          navigate("/upload");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  console.log("fileeeeeeeee", file)

  return (
    <div className="home-container">
      <Spin spinning={uploading}>
        <h1>Upload Files</h1>
        <p>Please upload the following files</p>

        {/* <div className="upload-container">
          <h2>Upload E-Signature</h2>
          <p>Upload a good Snippet of your e-signature</p>
          <Dragger
            onChange={onChangeImage}
            onDrop={onDrop}
            beforeUpload={beforeUploadImage}
            showUploadList={false}
            customRequest={dummyRequest}
          >
            <img src="/assets/Featured icon.png" alt="icon" />
            <p>
              <span>Click to upload</span> or drag and drop
            </p>
            <p>SVG, PNG, JPG (max. 800x400px)</p>
          </Dragger>
        </div> */}

        <div className="upload-container">
          <h2>Upload Excel Files</h2>
          <p>Please upload the Excel files in supported file formats.</p>
          <div {...getRootProps()} className="uploader-container">
            <input {...getInputProps()} />
            <img src="/assets/Featured icon.png" alt="icon" className="icon" />
            <p>
              <span>Click to upload</span> or drag and drop
            </p>
            <p>xls, xlsm, xlsx or MHTML</p>
          </div>
        </div>
        {file === null ? (
          ""
        ) : (
          <div>
            <h1>Uploaded File</h1>
            <div className="file-row">
              <h3>{file.path}</h3>{" "}
              <div className="icon" onClick={() =>setFile(null)}>
                <DeleteOutlined />
              </div>
            </div>
          </div>
        )}
        <div className="upload-container">
          <div className="button-container">
            <Button className="btn">Cancel</Button>
            <Button type="primary" onClick={submitHandler} className="btn done">
              Done
            </Button>
          </div>
        </div>

        {/* <ImageUpload />
      <FileUploader /> */}
      </Spin>
    </div>
  );
};

export default Home;
