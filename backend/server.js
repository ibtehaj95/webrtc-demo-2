const express = require('express');
const io = require('socket.io')({
    path: '/webrtc',

});

console.log('hello world');