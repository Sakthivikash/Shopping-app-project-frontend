import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Loading from "../../components/Loading";
import { logout } from "../../features/userSlice";
function ClientsDashboard() {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/users", {
        headers: {
          token: user.token,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setUsers(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.request.status === 403) {
          setError(true);
          setErrMsg(err.response.data);
        }
      });
  }, []);

  //if token is unvalid:
  if (error) {
    setTimeout(() => {
      dispatch(logout());
      navigate("/");
    }, 2500);
    return <Alert variant="danger">{errMsg}</Alert>;
  }

  if (loading) return <Loading />;
  if (users?.length == 0)
    return <h2 className="py-2 text-center">No users yet</h2>;

  return (
    <Table responsive striped bordered hover>
      <thead
        style={{ backgroundColor: "#505581", color: "white", fontSize: "18px" }}
      >
        <tr>
          <th>Client Id</th>
          <th>Client Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody style={{ backgroundColor: "#fad35e" }}>
        {users.map((user) => (
          <tr>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ClientsDashboard;
