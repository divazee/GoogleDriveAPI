import React, { useState } from "react";
import axios from "axios";

const Button = () => {
  const [selectedFile, setselectedFile] = useState("");
  const [filename, setFilename] = useState("Choose File");

  const chooseFile = e => {
    // console.log("object", e.target.files)
    setselectedFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    handleUpload(selectedFile).then(response => {
      console.log(response, "my data");
    });
  };

  const handleUpload = async selectedFile => {
    const url = "/upload";
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("file selected", formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    return axios.post(url, formData, config);

    // console.log("objecty", selectedFile)
    // const formData = new FormData();
    // formData.append('file', selectedFile);
    // console.log("file selected", formData)

    // try {
    // const result = await axios({
    //     method: 'POST',
    //     url: `/upload`,
    //     // url: `/upload?uploadType=media`,
    //     // params: {
    //     //     uploadType: media
    //     // },
    //     // data: selectedFile,
    //      formData,
    //     // headers: {
    //     //     // 'Content-Type': 'application/json; charset=UTF-8'
    //     //     'Content-Type': 'multipart/form-data'
    //     //     // 'Content-Type': 'application/pdf',
    //     //     // 'Content-Length': 50000
    //     // }
    //     headers: { 'content-type': 'multipart/form-data' },
    //     // headers: { 'content-type': 'application/x-www-form-urlencoded' },

    //     // url: `https://www.googleapis.com/upload/drive/v3/files?uploadType=media`,
    //     // formData,
    //     // headers: {
    // //         // 'Authorization': `Bearer ${}`,
    // //         'Content-Type': 'image/jpeg',
    // //         'Content-Length':  500000
    // //     }
    // })
    // console.log("object33:::", result)
    // } catch (e) {
    //     console.log("error::", e)
    // }
  };

  return (
    <div>
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

        {/* <div>
                        <input type="file" />
                    </div> */}

        <div className="">
          <button type="submit">Upload</button>
          {/* <button type="submit" onClick={handleUpload}>Upload</button> */}
        </div>
      </form>
    </div>
  );
};

export default Button;
