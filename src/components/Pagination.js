import React, { Fragment, useState } from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function PaginationComponent({ data, RenderComponent }) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // Get current posts
  const indexOfLastPost = page * 10;
  const indexOfFirstPost = indexOfLastPost - 10;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  //Total pages:
  const pageCount = Math.ceil(data.length / 10);
  console.log(pageCount);

  const handleChange = (event, value) => {
    setPage(value);
  };
  return (
    <>
      {currentPosts.map((post, idx) => (
        <RenderComponent key={idx} order={post} />
      ))}
      <Stack spacing={2}>
        <Pagination
          className="mt-4"
          color="primary"
          count={pageCount}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </>
  );
}

export default PaginationComponent;
