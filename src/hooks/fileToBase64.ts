export default function readFileDataAsBase64(file: File) {
  const fileByteArray: number[] = []

  // const reader = new FileReader()
  // reader.readAsArrayBuffer(file)
  // reader.onloadend = function (evt: any) {
  //   if (evt.target.readyState == FileReader.DONE) {
  //     var arrayBuffer = evt.target.result,
  //       array = new Uint8Array(arrayBuffer)
  //     console.log(array)
  //     for (var i = 0; i < array.length; i++) {
  //       fileByteArray.push(array[i])
  //     }
  //   }
  //   console.log('lib : ', fileByteArray)
  // }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = (evt: any) => {
      if (evt.target.readyState == FileReader.DONE) {
        var arrayBuffer = evt.target.result,
          array = new Uint8Array(arrayBuffer)
        // console.log(array)
        for (var i = 0; i < array.length; i++) {
          fileByteArray.push(array[i])
        }
      }
      resolve(fileByteArray)
    }
    reader.onerror = (err) => {
      reject(err)
    }
  })
}

// function readFileDataAsBase64(file: File) {
//   const fileByteArray: number[] = []
//   const reader = new FileReader()
//   reader.readAsArrayBuffer(file)

//   reader.onloadend = function (evt: any) {
//     if (evt.target.readyState == FileReader.DONE) {
//       var arrayBuffer = evt.target.result,
//         array = new Uint8Array(arrayBuffer)
//       console.log(array)
//       for (var i = 0; i < array.length; i++) {
//         fileByteArray.push(array[i])
//       }
//     }
//     images.push(fileByteArray)
//   }
// }
