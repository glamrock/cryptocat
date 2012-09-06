var CatFacts = function() {};
(function(){

var interestingFacts = [
'Both humans and cats have identical regions in the brain responsible for emotion.',
'A cat\'s brain is more similar to a human brain than that of a dog.',
'Cats can rotate each ear independently from the other in 180 degrees.',
'Cats\' hearing stops at 65 khz (kilohertz); humans\' hearing stops at 20 khz.',
'Cats see about 6 times better than humans at night.',
'Cats can judge within 3 inches the precise location of a sound being made 1 yard away.',
'Cats can be right-pawed or left-pawed.',
'Cats cannot see directly under their nose.',
'Cats express their present state of mind through their tail.',
'Cats walk on their toes.',
'Cats were worshipped as holy in Ancient Egypt and granted great respect in every household.',
'Phoenician ships likely brought the first domesticated cats to Europe in about 900 BC.',
'Ancient Egyptians shaved their eyebrows in mourning when the family cat died.',
'In Siam, a cat rode in a chariot at the head of a parade celebrating the new king.',
'Most cats adore sardines.',
'Cats use their whiskers to measure distances and changes in air pressure.',
'Abraham Lincoln kept four cats at the White House during his presidency.',
'Cats purr at the same frequency as an idling diesel engine.',
'Nikola Tesla was inspired to study electricity after his cat static-shocked him in his youth.',
'Isaac Newton invented the cat-flap.',
'Cats use their tails for balance and have nearly 30 individual bones in them.',
'Even though Napoleon conquered many countries, he was always very afraid of cats.'
];

CatFacts.getFact = function() {
	return interestingFacts[Math.floor(Math.random() * interestingFacts.length)];
}

})();