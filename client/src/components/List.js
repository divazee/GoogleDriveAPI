import React, { useState, useEffect } from "react";
import axios from "axios";

export const List = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    await axios.get(`/list`).then(result => {
      console.log("result", result);
      setLists(result.data);
      setLoading(false);
    });
  };

  const tableData = () => {
    return lists.map((list, i) => {
      const { name, id } = list;
      return (
        <tr key={id} className="text-left">
          <td>{i + 1}</td>
          <td onClick={() => clicka(list)}>{name}</td>
          <td>
            <small>delete</small>
          </td>
        </tr>
      );
    });
  };

  const clicka = list => {
    console.log("clicka", list);
    
  };

  return (
    <table>
      <thead>
        {loading ? (
          <tr>
            <td colSpan="3">Loading...</td>
          </tr>
        ) : (
          <tr>
            <td>S/N</td>
            <td>File</td>
            <td>Actions</td>
          </tr>
        )}
      </thead>
      <tbody>{tableData()}</tbody>
    </table>
  );
};
