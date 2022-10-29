const jasperclient = require('jasperclient');
const client = new jasperclient({
  host: '34.155.42.71',
  path: 'jasperserver',
  username: 'jasperadmin',
  password: 'p784HeNEY5K0',
  useBasicAuth: true
});

export default function getReport(req, res) {
  const { title, param_faculty, param_department } = req.body;

  // Fetch a report
  client.reports.run({
    path: `/Reports/${title}`,
    format: 'pdf',
    params: {
      param_faculty,
      param_department,
    }
  }, {
    responseType: 'stream',
  }).then(function (response) {
    response.data.pipe(res)
  }).catch(function (error) {
    return res.status(403).json(error);
  });
}
