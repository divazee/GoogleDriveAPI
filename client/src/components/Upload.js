import React, { useState } from "react";
// import Message from './Message';
import axios from "axios";
import Progress from "./Progress";

const Button = () => {
  const [selectedFile, setselectedFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState("");
  const [message, setMessage] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);

  const chooseFile = e => {
    setselectedFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onFormSubmit = e => {
    e.preventDefault();
    try {
      handleUpload(selectedFile).then(response => {
        console.log(response, "my data");
        const { name } = response.data;
        console.log("upload name::::;", name);
        setUploadedFile(name);
        setMessage('File Uploaded')
      });
    } catch (err) {
      if (err.response.status === 500){
        console.log("object secrve")
        setMessage('There was a problem with the server')
      } else {
        console.log("error::::777", err.response.data)
        setMessage('File ish')
      }
    }
  };

  const handleUpload = async selectedFile => {
    const url = "/upload";
    const formData = new FormData();
    formData.append("file", selectedFile);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
      //  console.log("Progress:-" + Math.round( progressEvent.loaded  / progressEvent.total * 100) + '%');
        setUploadPercent(
          parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          ))
        
        // clear percentage
        setTimeout(() => setUploadPercent(0), 5000)
      }
    };
      const result = await axios.post(url, formData, config);
      return result
  };

  return (
    <div>
      {/* {message ? <Message msg={message} /> : null} */}
      {uploadedFile ? (
        <div>
          <span>
            Uploaded Successfully: <strong>{uploadedFile}</strong>
          </span>
        </div>
      ) : message}
      <form onSubmit={onFormSubmit}>
        <div className="custom-file mb-3">
          <input
            type="file"
            className="custom-file-input"
            name="selectedFile"
            id="ctrl"
            onChange={chooseFile}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercent} />

        <div className="">
          <button type="submit">Upload PDF</button>
          {/* <button type="submit" onClick={handleUpload}>Upload</button> */}
        </div>
      </form>
    </div>
  );
};

export default Button;
