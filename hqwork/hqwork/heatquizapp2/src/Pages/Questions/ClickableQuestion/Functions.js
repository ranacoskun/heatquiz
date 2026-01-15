// Function to calculate item position and dimensions inside clickable question
export const getItemPositionStyle = (imageWidth, BackgroundImageWidth, p, offset, topOffset) => ({
    width: ((imageWidth)/BackgroundImageWidth)* p.Width,
    height: ((imageWidth)/BackgroundImageWidth)*p.Height,
    left: ((imageWidth)/BackgroundImageWidth)*p.X - offset,
    top:  ((imageWidth)/BackgroundImageWidth)*p.Y + topOffset,
})