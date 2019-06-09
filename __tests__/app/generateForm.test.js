const generateForm = require('../../app/generateForm');

describe('generateForm', () => {
  test('main', () => {
    expect(generateForm('./path')).toEqual(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login form</title>
</head>
<body>
<form action="./path" method="POST">
  <table>
    <tbody>
      <tr>
        <td>ユーザ名：</td>
        <td><input id="username" type="text" name="username" width="10"></td>
      </tr>
      <tr>
        <td>パスワード：</td>
        <td><input id="password" type="password" name="password" width="10"></td>
      </tr>
    </tbody>
  </table>
  <button type="submit">ログイン</button>
</form>
</body>
</html>`);
  });
});
