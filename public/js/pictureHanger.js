var pictureDiv = document.getElementById("pictures")
var pictures = pictureDiv.getElementsByTagName("img")
var coordsDiv = document.getElementById("coords")
var coords = coordsDiv.getElementsByTagName("p1")
var fileTypesDiv = document.getElementById("fileTypes")
var fileTypes = fileTypesDiv.getElementsByTagName("p1")
var pic, width, height, ratio, depthExtra, rotation
var items = []
var strCoords = []
var intCoords = []
var coordIndiv = []
var fileType = []

//Get and save the coordinates that correspond with posts.
for (i = 0; i < coords.length; i++) {
    items[i] = coords[i].innerHTML
    strCoords.push(items[i].split(" "))
    coordIndiv = []
    for (j = 0; j < strCoords[i].length; j++) {
        coordIndiv.push(parseFloat(strCoords[i][j]))
    }
    intCoords.push(coordIndiv)
}

//Get the file types for each post. Can only combine with above
//If every post with coordinates also has a file type.
for (i = 0; i < fileTypes.length; i ++) {
    fileType.push(fileTypes[i].innerHTML)
}

//Manually write each post into demo.pug with proper coords and files.
for (i = 0; i < pictures.length; i++) {
    pic = pictures[i]
    width = pic.width
    height = pic.height
    ratio = width / height
    if (height < width) {
        height = 1
        width = ratio
    } else {
        width = 1
        height = 1 / ratio
    }

    if (intCoords[i][2] == -1.9) {
        rotation = 0
        depthExtra = intCoords[i][2] - .01
    } else if (intCoords[i][2] == 1.9) {
        rotation = 180
        depthExtra = intCoords[i][2] + .01
    } else if (intCoords[i][0] == 1.9) {
        rotation = 90
        depthExtra = intCoords[i][0] + .01
    } else {
        rotation = 270
        depthExtra = intCoords[i][0] - .01
    }

    if (fileType[i] == 'gif')
    {
        document.write('<a-entity geometry="primitive:plane;" material="shader:gif;src: #' + pic.id + '" position="' + intCoords[i][0] + ' ' + intCoords[i][1] + ' ' + intCoords[i][2] + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-entity>')
        width += .1
        height += .1
        if (rotation == 0 || rotation == 180) {
            document.write('<a-image class="a" src="#frametexture" position="' + intCoords[i][0] + ' ' + intCoords[i][1] + ' ' + depthExtra + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-image>')
        } else {
            document.write('<a-image class="a" src="#frametexture" position="' + depthExtra + ' ' + intCoords[i][1] + ' ' + intCoords[i][2] + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-image>')
        }
    }
    else if (fileType[i] == '' || fileType[i] == 'image')
    {
        document.write('<a-image class="a" src="#' + pic.id + '" position="' + intCoords[i][0] + ' ' + intCoords[i][1] + ' ' + intCoords[i][2] + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-image>')
        width += .1
        height += .1
        if (rotation == 0 || rotation == 180) {
            document.write('<a-image class="a" src="#frametexture" position="' + intCoords[i][0] + ' ' + intCoords[i][1] + ' ' + depthExtra + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-image>')
        } else {
            document.write('<a-image class="a" src="#frametexture" position="' + depthExtra + ' ' + intCoords[i][1] + ' ' + intCoords[i][2] + '" rotation="0 ' + rotation + ' 0" width="' + width + '" height="' + height + '"></a-image>')
        }
    }
    else {
        console.log('type is not what it should be')
        console.log('type is ' + fileType[i])
    }
}
