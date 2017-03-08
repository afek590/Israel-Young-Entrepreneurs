var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var mongoose = require('mongoose');

// Require the routes
var index = require('./routes/index');
var adminsManageRoute = require('./routes/adminsManage');
var contentManageRoute = require('./routes/contentManage');
var picturesManageRoute = require('./routes/picturesManage');
var videosManageRoute = require('./routes/videosManage');
var panelManagement = require('./routes/panelManagement');
var forumRoute = require('./routes/forum');
var videosRoute = require('./routes/videos');
var picturesRoute = require('./routes/pictures');
var contentRoute = require('./routes/content');

var Schema = mongoose.Schema;
mongoose.connect('mongodb://iye:iye123@ds052819.mlab.com:52819/iye');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Connection succeded');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// < -------------------------- Define routes -------------------------->
app.use('/', index);
app.use('/adminsManage', adminsManageRoute);
app.use('/contentManage', contentManageRoute);
app.use('/picturesManage', picturesManageRoute);
app.use('/videosManage', videosManageRoute);
app.use('/panelManagement', panelManagement);
app.use('/forum', forumRoute);
app.use('/pictures', picturesRoute);
app.use('/content', contentRoute);
app.use('/videos', videosRoute);

// < -------------------------- End of routes -------------------------->




// < -------------------------- Database's schemas -------------------------->
var adminSchema = new Schema({
  name: String,
  email: String
});
var Admin = mongoose.model('Admins', adminSchema);

var contentSchema = new Schema({
    title: String,
    priority: Number,
    description: String
});
var Content = mongoose.model('Contents', contentSchema);

var pictureSchema = new Schema({
    data: String ,
    contentType: String,
    title: String,
    desc: String
});
var Picture = mongoose.model('Pictures', pictureSchema);

var videoSchema = new Schema({
    data: String,
    contentType: String,
    name: String
});
var Video = mongoose.model('Videos', videoSchema);

// < -------------------------- End of database's schemas -------------------------->





// < -------------------------- Server functions -------------------------->

//  *** Admins' functions ***

app.post('/postadmin',function (req, res) {
    new Admin({
        name: req.body.name,
        email: req.body.email
    }).save(function(err){
        if(err)
            console.log(err);
        else
            res.json('saved');
    });
});

app.get('/admins', function (req, res) {
    Admin.find(function(err, admins) {
        res.json(admins);
    });
});

app.post('/deladmin', function (req, res) {
    Admin.remove({name: req.body.name,
        email: req.body.email}, function(err) {
        console.log(err);
    });
    res.json('admin deleted');
});


// *** Content's function ***

// Posting new content to the database
app.post('/postcontent', function(req, res){
    new Content({
        title: req.body.title,
        priority: req.body.priority,
        description: req.body.description
    }).save(function(err){
        if(err)
            console.log(err)
        else
            res.json('saved');
    });
});

app.get('/getcontent', function(req, res){
    Content.find(function(err, content) {
        res.json(content);
    });
});

app.post('/updatecontent', function(req, res){
    Content.remove({_id : req.body._id}, function(err){
        console.log(err);
    });
    new Content({
        title: req.body.title,
        priority: req.body.priority,
        description: req.body.description
    }).save(function(err){
        if(err)
            console.log(err);
        else
            res.json('updated');
    });
});

app.post('/delcontent', function(req, res){
    Content.remove({_id : req.body._id}, function(err){
        if(err)
            console.log('ERRPR: ' + err);
        else
            res.json('Content removed.');
    });
});


// *** Picture's function ***

app.post('/postpicture', multipartMiddleware, function(req, res)
{
    var file = req.files.file;
    var pic = new Picture;
    var bitmap = fs.readFileSync(file.path);
    pic.data = bitmap.toString('base64');
    pic.contentType = file.type;
    pic.title = req.body.title;
    pic.desc = req.body.desc;
    console.log(pic.data);
    if(pic.contentType != "image/jpg" && pic.contentType != "image/jpeg")
    {
        res.json('no-support');
    }
    else
    {
        pic.save(function(err){
            if(err)
                throw err;
        });
        res.json('Picture saved.');
    }
});

app.get('/getpictures', function(req, res){
    Picture.find(function(err, content) {
        //console.log(content);
        res.json(content);
    });
});

app.get('/getnodatapictures', function(req, res){
    Picture.find({}, { _id: 1, desc: 1, title: 1 }, function(err, content){
        res.json(content);
    });
});

app.post('/delpicture', function(req, res){
    Picture.remove({_id : req.body._id}, function(err){
        if(err)
            console.log('ERRPR: ' + err);
        else
            res.json('Picture removed.');
    });
});

app.post('/updatepicture', function(req, res){
    Picture.findOne({ _id: req.body.id }, function(err, picture){
        if(!err)
        {
            console.log(picture);
            if(!picture)
            {
                console.log('Picture update error.1');
            }
            else
            {
                picture.title = req.body.title;
                picture.desc = req.body.description;
                picture.save(function(err){
                    if(!err)
                    {
                        console.log('Picture updated');
                        res.json('Picture updated');
                    }
                    else
                        console.log('Picture update error.2');
                });
            }
        }
    });
});


// *** Video's function ***

app.post('/postvideo', multipartMiddleware, function(req, res)
{
    var file = req.files.file;
    var video = new Video;
    var bitmap = fs.readFileSync(file.path);
    video.data = bitmap.toString('base64');
    video.contentType = file.type;
    video.name = req.body.name;
    console.log(video.data);
    if(video.contentType != "video/mp4")
    {
        res.json('no-support');
    }
    else
    {
        video.save(function(err){
            if(err)
                throw err;
        });
        res.json('Video saved.');
    }
});

app.get('/getvideos', function(req, res){
    Video.find(function(err, content) {
        res.json(content);
    });
});

app.get('/getnodatavideos', function(req, res){
    Video.find({}, { _id: 1, name: 1 }, function(err, content){
        res.json(content);
    });
});

app.post('/delvideo', function(req, res){
    Video.remove({_id : req.body._id}, function(err){
        if(err)
            console.log('ERROR: ' + err);
        else
            res.json('Video removed.');
    });
});

app.post('/updatevideo', function(req, res){
    Video.findOne({ _id: req.body.id }, function(err, video){
        if(!err)
        {
            console.log(video);
            if(!video)
            {
                console.log('Video update error.1');
            }
            else
            {
                video.name = req.body.name;
                video.save(function(err){
                    if(!err)
                    {
                        console.log('Video updated');
                        res.json('Video updated');
                    }
                    else
                        console.log('Video update error.2');
                });
            }
        }
    });
});


// < -------------------------- End Server functions -------------------------->

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
