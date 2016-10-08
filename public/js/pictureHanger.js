var pictureDiv = document.getElementById("pictures")
var pictures = pictureDiv.getElementsByTagName("img")
var coordsDiv = document.getElementById("coords")
var coords = coordsDiv.getElementsByTagName("p1")
var pic, width, height, ratio, depthExtra, rotation
var items = []
var strCoords = []
var intCoords = []
var coordIndiv = []
for (i = 0; i < coords.length; i++)
{
	items[i] = coords[i].innerHTML
	strCoords.push(items[i].split(" "))
    coordIndiv = []
	for (j = 0; j < strCoords[i].length; j++)
	{
        coordIndiv.push(parseFloat(strCoords[i][j]))
	}
    intCoords.push(coordIndiv)
}
for (i = 0; i < pictures.length; i++)
{
	//window.alert(intCoords[i][0])
	//window.alert(intCoords[i][1])
	//window.alert(intCoords[i][2])
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
    
    if (intCoords[i][2] == -1.9)
    {
        rotation = 0
        depthExtra = intCoords[i][2]-.01
    }
    else if (intCoords[i][2] == 1.9)
    {
        rotation = 180
        depthExtra = intCoords[i][2]+.01
    }
    else if (intCoords[i][0] == 1.9)
    {
        rotation = 90
        depthExtra = intCoords[i][0]+.01
    }
    else
    {
        rotation = 270
        depthExtra = intCoords[i][0]-.01
    }

    document.write('<a-image class="a" src="#'+pic.id+'" position="'+intCoords[i][0]+' '+intCoords[i][1]+' '+intCoords[i][2]+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"><a-animation attribute="scale" begin="expand" to="1.2 1.2 1.2"></a-animation></a-image>')
    width += .1
    height += .1
    if (rotation == 0 || rotation == 180)
    {
        document.write('<a-image color="black" position="'+intCoords[i][0]+' '+intCoords[i][1]+' '+depthExtra+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"></a-image>')
    }
    else
    {
        document.write('<a-image color="black" position="'+depthExtra+' '+intCoords[i][1]+' '+intCoords[i][2]+'" rotation="0 '+rotation+' 0" width="' + width + '" height="' + height + '"></a-image>')
    }
}