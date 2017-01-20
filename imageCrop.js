var async = require('async');
var AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var gm = require('gm').subClass({
    imageMagick: true
});
var s3 = new AWS.S3();
var uploadedImage = null;
var folderPath = "media/vrview/images_tile/";
var count = 0;
var item = {};
var clientName = "";
var tableName = "VR_ImageUploadLogInfo";
exports.handler = function(event, context, callback) {
    var bufferedImageArr = [];
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    clientName = srcKey.split("/")[0];
    //console.log("event bucket name "+srcBucket+" Source key "+srcKey + "clientName "+clientName);
    var dstBucket = srcBucket + "-resized";
    if (srcBucket == dstBucket) {
        callback("Source and destination buckets are the same.");
        return;
    }
    //console.log("ClientName "+clientName)
    item = {
        ImageName: srcKey,
        ClientName: clientName,
        startTime: Date()
    }
    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1];
    if (imageType != "jpg" && imageType != "png") {
        callback('Unsupported image type: ${imageType}');
        return;
    }
    s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
    }, function(err, data) {
        if (err) {
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            callback(message);
        } else {
            var temp = new MultiRes(data, imageType, srcKey);
        }
    });
    var MultiRes = function(_image, _imageType, _srcKey) {
        var fileNameArr = _srcKey.split("/");
        var imgInfoArr = [{
            fileName: fileNameArr[fileNameArr.length - 1],
            resolution: "/images_2048/",
            w: 2048,
            h: 2048,
            xPos: 0,
            yPos: 0,
            outputW: 2048,
            outputH: 2048
        }, {
            fileName: fileNameArr[fileNameArr.length - 1],
            resolution: "/images_1024/",
            w: 2048,
            h: 2048,
            xPos: 0,
            yPos: 0,
            outputW: 1024,
            outputH: 1024
        }, {
            fileName: "mobile_%v.jpg",
            resolution: "/images_tile/",
            w: 2048,
            h: 2048,
            xPos: 0,
            yPos: 0,
            outputW: 1024,
            outputH: 1024
        }, {
            fileName: "mres_%v/l1/1/l1_%v_1_1.jpg",
            resolution: "/images_tile/",
            w: 2048,
            h: 2048,
            xPos: 0,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l2/1/l2_%v_1_1.jpg",
            resolution: "/images_tile/",
            w: 1024,
            h: 1024,
            xPos: 0,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l2/1/l2_%v_1_2.jpg",
            resolution: "/images_tile/",
            w: 1024,
            h: 1024,
            xPos: 1024,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l2/2/l2_%v_2_1.jpg",
            resolution: "/images_tile/",
            w: 1024,
            h: 1024,
            xPos: 0,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l2/2/l2_%v_2_2.jpg",
            resolution: "/images_tile/",
            w: 1024,
            h: 1024,
            xPos: 1024,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/1/l3_%v_1_1.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 0,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/1/l3_%v_1_2.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 512,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/1/l3_%v_1_3.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1024,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/1/l3_%v_1_4.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1536,
            yPos: 0,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/2/l3_%v_2_1.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 0,
            yPos: 512,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/2/l3_%v_2_2.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 512,
            yPos: 512,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/2/l3_%v_2_3.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1024,
            yPos: 512,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/2/l3_%v_2_4.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1536,
            yPos: 512,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/3/l3_%v_3_1.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 0,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/3/l3_%v_3_2.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 512,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/3/l3_%v_3_3.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1024,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/3/l3_%v_3_4.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1536,
            yPos: 1024,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/4/l3_%v_4_1.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 0,
            yPos: 1536,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/4/l3_%v_4_2.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 512,
            yPos: 1536,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/4/l3_%v_4_3.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1024,
            yPos: 1536,
            outputW: 512,
            outputH: 512
        }, {
            fileName: "mres_%v/l3/4/l3_%v_4_4.jpg",
            resolution: "/images_tile/",
            w: 512,
            h: 512,
            xPos: 1536,
            yPos: 1536,
            outputW: 512,
            outputH: 512
        }]
        
        var dstKey =  clientName + "/media/vrview" + imgInfoArr[0].resolution + fileNameArr[1] + "/" + fileNameArr[2] + "/" + imgInfoArr[0].fileName;
        if (dstKey.indexOf("%v") > 0) {
            dstKey = getFileName(dstKey);
        }
        cropImages(_image, 0, _imageType);

        function getFileName(_dstKey) {
            var tempDstKeyArr = _dstKey.split("%v");
            var returnDstKey = "";
            var replaceStr = "";
            if (_srcKey.indexOf("eft.jpg") > 0) {
                replaceStr = "l"
            } else if (_srcKey.indexOf("ack.jpg") > 0) {
                replaceStr = "b"
            } else if (_srcKey.indexOf("own.jpg") > 0) {
                replaceStr = "d"
            } else if (_srcKey.indexOf("ront.jpg") > 0) {
                replaceStr = "f"
            } else if (_srcKey.indexOf("ight.jpg") > 0) {
                replaceStr = "r"
            } else if (_srcKey.indexOf("p.jpg") > 0) {
                replaceStr = "u"
            }
            for (var i in tempDstKeyArr) {
                returnDstKey += (i < tempDstKeyArr.length - 1) ? (tempDstKeyArr[i] + replaceStr) : tempDstKeyArr[i]
            }
            return returnDstKey;
        }

        function cropImages(_image, _count, _imageType) {
            resize(_image, _count, _imageType).then(function(response) {
                _count++;
                var tempFileName = (imgInfoArr[_count]) ? imgInfoArr[_count].fileName : null;
                if (imgInfoArr.length > _count && tempFileName) {
                    if (imgInfoArr[_count].fileName.indexOf("%v") > 0) {
                        tempFileName = getFileName(imgInfoArr[_count].fileName);
                    }
                    dstKey = clientName+ "/media/vrview" + imgInfoArr[_count].resolution + fileNameArr[1] + "/" + fileNameArr[2] + "/" + tempFileName;
                    cropImages(_image, _count, _imageType);
                } else {
                    item.endTime = Date();
                    item.status = 1;
                    updateDynamo();                    
                }
            }, function(error) {
                item.endTime = Date();
                item.status = 0;
                updateDynamo();
            })
        }

        function updateDynamo(){
            //console.log("update dynamo bd")
            dynamo.updateItem({
                TableName: tableName,
                Key: {
                    "ClientName": clientName
                },
                UpdateExpression: "SET #attrName = list_append(#attrName, :attrValue)",
                ExpressionAttributeNames: {
                    "#attrName": "ImageLists"
                },
                ExpressionAttributeValues: {
                    ':attrValue': [item]
                }
            }, function(err, success) {                
                //console.log("updateItem err "+err+" success "+success);
                if(err && (err.message.indexOf("does not exist")>0)){
                    var param = { ClientName:clientName, ImageLists:[item]};
                    dynamo.putItem({TableName:tableName, Item:param}, function(err, success){  
                        //console.log("putItem err "+err+" success "+success);                     
                        if(err){
                             context.fail('Unable to Put Item STR_Automation_Status',JSON.stringify(err));
                        }else{
                            context.done(null, JSON.stringify(success));
                        }
                    });
                }else{
                    context.done(null, JSON.stringify(success));
                }                
            });
        }

        function resize(_sourceImage, _count, _imageType) {
            var prom = new Promise(function(resolve, reject) {
                gm(_sourceImage.Body).crop(imgInfoArr[_count].w, imgInfoArr[_count].h, imgInfoArr[_count].xPos, imgInfoArr[_count].yPos).toBuffer(_imageType, function(err, buffer) {
                    if (err) {
                        reject(err);
                    } else {
                        resizeImage(buffer);
                    }
                });

                function resizeImage(buffer) {
                    gm(buffer).resize(imgInfoArr[_count].outputW, imgInfoArr[_count].outputH).quality(90).toBuffer(_imageType, function(err, buffer) {
                        if (err) {
                            reject(err);
                        } else {
                            uploadImage(buffer);
                        }
                    })
                };

                function uploadImage(buffer) {
                    s3.putObject({
                        Bucket: dstBucket,
                        Key: dstKey,
                        Body: buffer,
                        ContentType: _imageType
                    }, function(err, success) {
                        if (err) {
                            reject("error on uploading " + err);
                        } else {
                            resolve("success on uploading")
                        }
                    });
                };
            });
            return prom;
        }
    }
};