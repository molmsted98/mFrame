var pictureDiv = document.getElementById("pictures")
var pictures = pictureDiv.getElementsByTagName("img")
var pic, width, height, ratio, depthExtra, rotation
//placeholder array for the current number of pictures, will be loaded later
var items = [
	[0,2,-1.9],
	[1,2,1.9],
	[-1.9,2,0],
	[1.9,4,0]
]
for (i = 0; i < pictures.length; i++)
{
	pic = pictures[i]
	width = pic.width
    height = pic.height
    ratio = width/height
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
    if (items[i][2] == -1.9)
    {
        rotation = 0
        depthExtra = items[i][2]-.01
    }
    else if (items[i][2] == 1.9)
    {
        rotation = 180
        depthExtra = items[i][2]+.01
    }
    else if (items[i][0] == 1.9)
    {
        rotation = 90
        depthExtra = items[i][0]+.01
    }
    else
    {
        rotation = 270
        depthExtra = items[i][0]-.01
    }
    
    document.write('<a-image src="#'+pic.id+'" position="'+items[i][0]+' '+items[i][1]+' '+items[i][2]+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"></a-image>')
    width += .1
    height += .1
    if (rotation == 0 || rotation == 180)
    {
        document.write('<a-image color="black" position="'+items[i][0]+' '+items[i][1]+' '+depthExtra+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"></a-image>')
    }
    else
    {
        document.write('<a-image color="black" position="'+depthExtra+' '+items[i][1]+' '+items[i][2]+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"></a-image>')
    }
}