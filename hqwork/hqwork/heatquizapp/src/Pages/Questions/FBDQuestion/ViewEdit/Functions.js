export function calculateCPdimensions(imageWidth, imageHeight,specificedWidth, specificedHeight, element, Offset=0){
    return({            
        width: (element.Width * specificedWidth)/imageWidth,
        height: (element.Height * specificedHeight) /imageHeight,
        left: (element.X * specificedWidth) /imageWidth,
        top: (element.Y * specificedHeight) /imageHeight,
    })
}