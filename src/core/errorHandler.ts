const handleAndRethrow = (err: Error) => {
  console.log(err.message);
  throw err;
};

export default handleAndRethrow;
