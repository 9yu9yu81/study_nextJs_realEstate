// // files => return byteArray[]
// export default function filesToByte(files: File[]) {
//   const fileByteArray: number[] = []
//   const images: number[][] = []

//   files.map((file) => {
//     new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsArrayBuffer(file)
//       reader.onloadend = (evt: any) => {
//         if (evt.target.readyState == FileReader.DONE) {
//           var arrayBuffer = evt.target.result,
//             array = new Uint8Array(arrayBuffer)
//           // console.log(array)
//           for (var i = 0; i < array.length; i++) {
//             fileByteArray.push(array[i])
//           }
//         }
//         resolve(fileByteArray)
//       }
//       reader.onerror = (err) => {
//         reject(err)
//       }
//     }).then((res: any) => images.push(res))
//   })
//   return images
// }

// files => return ArrayBuffer[]
export default function filesToByte(files: File[]) {
  const images: ArrayBuffer[] = []

  files.map((file) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = (evt: any) => {
        if (evt.target.readyState == FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer)
          // console.log(array)
          resolve(array)
        }
      }
      reader.onerror = (err) => {
        reject(err)
      }
    }).then((res: any) => images.push(res))
  })
  return images
}

// // files => return blob[]
// export default function filesToByte(files: File[]) {
//   const images: Blob[] = []
//   // const fileByteArray: Blob = new Blob(undefined)

//   files.map((file) => {
//     new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.readAsArrayBuffer(file)
//       reader.onloadend = (evt: any) => {
//         if (evt.target.readyState == FileReader.DONE) {
//           var arrayBuffer = evt.target.result,
//             array = new Uint8Array(arrayBuffer)
//           resolve(array)
//         }
//       }
//       reader.onerror = (err) => {
//         reject(err)
//       }
//     }).then((res: any) => images.push(new Blob([res], { type: 'image/png' })))
//   })
//   return images
// }
