import database from '../../../../infra/database.js';

async function status(_request, response){
  const result = await database.query('SELECT 1 + 1;')
  console.log(result)
  response.status(200).json({
    status: 'ok',
    result
  });
}

export default status; 