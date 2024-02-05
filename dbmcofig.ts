module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'file-service',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
