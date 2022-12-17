//generate JobId
function randomString(length){
  var str = "";
  var arr = ['A', 'B', 'C', 'D', 'E', 'F',
          'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
          'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for(var i=0; i<length; i++){
      let pos = Math.floor(Math.random() * (arr.length));
      str += arr[pos];
  }
  return str;
}
function generateJobId(alpha_length){
  const date = new Date()
  const arr = date.toLocaleDateString().split('/')
  const JobId = arr[0]+arr[1]+randomString(alpha_length)
  return JobId
}
