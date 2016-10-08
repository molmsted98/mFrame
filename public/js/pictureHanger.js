var pictureDiv = document.getElementById("pictures")
var pictures = pictureDiv.getElementsByTagName("img")
var pic, width, height, ratio, depthExtra
//placeholder array for the current number of pictures, will be loaded later
var items = [
	[0,2,-1.9],
	[1,2,1.9],
	[-1,2,1.9],
	[1,4,-1.9]
]
for (i = 0; i < pictures.length; i++)
{
	pic = pictures[i]
	width = pic.width
    height = pic.height
    ratio = width/height
    if (items[i][2] < 0)
    {
    	depthExtra = items[i][2]-.01
    }
    else
    {
    	depthExtra = items[i][2]+.01
    }
    if (height < width)
    {
      height = 1
      width = ratio
    }
    else
    {
      width = 1
      height = 1/ratio
    }
    document.write('<a-image src="#'+pic.id+'" position="'+items[i][0]+' '+items[i][1]+' '+items[i][2]+'" rotation="0 0 0" width="' + width + '" height="' + height + '"></a-image>')
    width += .1
    height += .1
    document.write('<a-image color="black" position="'+items[i][0]+' '+items[i][1]+' '+depthExtra+'" rotation="0 0 0" width="' + width + '" height="' + height + '"></a-image>')
}