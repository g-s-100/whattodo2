<template>
  <div>
  <p>Identifiant:</p>
  <input v-model="userID" type="text">
  <p>Mot de Passe:</p>
  <input v-model="password" type="password" @keyup.enter='logIn'>
  <button @click="logIn" type="button">Connection</button></br>
  <button @click="changeConectionType" type="button">Créer nouvel utilisateur</button>
  </div>
</template>

<script>
export default {
  name: 'loginhtml'
}
</script>
