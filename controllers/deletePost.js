const db = mongoose.connect('mongodb://localhost:27017/node-blog', { useUnifiedTopology: true })
.then(() => 'You are now connected to Mongo!')
.catch(err => console.error('Something went wrong', err))

module.exports = async (req, res) => {
  res.render('/admin')
  console.log("Here");
};