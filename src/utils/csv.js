function convertToCSV(objArray) {
  const arrData = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;

  if (arrData.length === 0) throw new Error("Empty array cannot be converted to CSV");

  const arrKeys = Object.keys(arrData[0]).sort();

  let st_file = arrKeys.join(",") + "\n";

  for (let i = 0; i < arrData.length; i++) {
    let st_line = arrKeys.map(k => arrData[i][k] ?? "").join(",");
    st_file += st_line + "\n";
  }

  return st_file;
}


module.exports={
  convertToCSV
}