module.exports = {
    'port':process.env.PORT || 4001,
    'db': process.env.MONGODB_URI ||'mongodb://localhost:27017/smartSafe', 
    'secret':'smartsafetokensecret'
};