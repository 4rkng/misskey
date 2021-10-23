# Templinio
タイムラインは、[ノート](./note)が時系列で表示される機能です。 タイムラインには以下で示す種類があり、種類によって表示されるノートも異なります。 なお、タイムラインの種類によってはサーバーにより無効になっている場合があります。

## Hejma
自分のフォローしているユーザーの投稿が流れます。HTLと略されます。

## Loka
全てのローカルユーザーの「ホーム」指定されていない投稿が流れます。LTLと略されます。

## Sociala
自分のフォローしているユーザーの投稿と、全てのローカルユーザーの「ホーム」指定されていない投稿が流れます。STLと略されます。

## Malloka
全てのローカルユーザーの「ホーム」指定されていない投稿と、サーバーに届いた全てのリモートユーザーの「ホーム」指定されていない投稿が流れます。GTLと略されます。

## 比較
<<<<<<< HEAD
| ソース          |           |       | Templinio |         |         |
| ------------ | --------- | ----- | --------- | ------- | ------- |
| Uzantoj      | Videbleco | Hejma | Loka      | Sociala | Malloka |
| ローカル (フォロー)  | Publikigi | ✔     | ✔         | ✔       | ✔       |
|              | Hejma     | ✔     |           | ✔       |         |
|              | Sekvantoj | ✔     | ✔         | ✔       | ✔       |
| リモート (フォロー)  | Publikigi | ✔     |           | ✔       | ✔       |
|              | Hejma     | ✔     |           | ✔       |         |
|              | Sekvantoj | ✔     |           | ✔       | ✔       |
| ローカル (未フォロー) | Publikigi |       | ✔         | ✔       | ✔       |
|              | Hejma     |       |           |         |         |
|              | Sekvantoj |       |           |         |         |
| リモート (未フォロー) | Publikigi |       |           |         | ✔       |
|              | Hejma     |       |           |         |         |
|              | Sekvantoj |       |           |         |         |
=======
| ソース                   |           |       | Templinio |         |         |
| --------------------- | --------- | ----- | --------- | ------- | ------- |
| Uzantoj               | Videbleco | Hejma | Loka      | Sociala | Malloka |
| Lokaj (sekvataj)      | Publika   | ✔     | ✔         | ✔       | ✔       |
|                       | Nur hejma | ✔     |           | ✔       |         |
|                       | Sekvantoj | ✔     | ✔         | ✔       | ✔       |
| Transaj (sekvataj)    | Publika   | ✔     |           | ✔       | ✔       |
|                       | Nur hejma | ✔     |           | ✔       |         |
|                       | Sekvantoj | ✔     |           | ✔       | ✔       |
| Lokaj (ne sekvataj)   | Publika   |       | ✔         | ✔       | ✔       |
|                       | Nur hejma |       |           |         |         |
|                       | Sekvantoj |       |           |         |         |
| Transaj (ne sekvataj) | Publika   |       |           |         | ✔       |
|                       | Nur hejma |       |           |         |         |
|                       | Sekvantoj |       |           |         |         |
>>>>>>> a1af83c0ab30c01fa3a0990b1486987e536d46fb
