// Declares the global scope
// Other globals are defined in other files, including cryptocat.js, cryptocatRandom.js.

var Cryptocat = function() {};
Cryptocat.fileSize = 4096; // Maximum encrypted file sharing size, in kilobytes.
Cryptocat.chunkSize = 64511; // Size in which file chunks are split, in bytes.