// Initialize variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var playerImage = new Image();
var goodItemImage = new Image();
var badItemImage = new Image();
var heartImage = new Image();
var gameOverImage = new Image();
var playerWidth = 100; // Set the desired width for the player image
var playerHeight = 100; // Set the desired height for the player image
var goodItemWidth = 60; // Set the desired width for the good item image
var goodItemHeight = 60; // Set the desired height for the good item image
var badItemWidth = 80; // Set the desired width for the bad item image
var badItemHeight = 80; // Set the desired height for the bad item image
var heartWidth = 30; // Set the desired width for the heart image
var heartHeight = 30; // Set the desired height for the heart image
var playerX = canvas.width / 2 - playerWidth / 2;
var playerY = canvas.height - playerHeight;
var goodItems = []; // Array to store good item positions and speeds
var badItems = []; // Array to store bad item positions and speeds
var maxItems = 5; // Maximum number of items on the screen
var itemSpeed = 1;
var fallAcceleration = 0.005; // Adjust the acceleration value to control the speed increase
var spawnCounter = 1; // Counter for spawning items
var score = 0;
var hearts = 3;
var isGameOver = false;

// Load images
playerImage.src = "player.png";
goodItemImage.src = "good_item.png";
badItemImage.src = "bad_item.png";
heartImage.src = "heart.png";
gameOverImage.src = "game_over.jpg";

// Handle player-item collision
function checkCollision() {
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    if (
      playerX < goodItem.x + goodItemWidth &&
      playerX + playerWidth > goodItem.x &&
      playerY < goodItem.y + goodItemHeight &&
      playerY + playerHeight > goodItem.y
    ) {
      score += 5;
      goodItems.splice(i, 1); // Remove the collided good item
    }
  }

  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    if (
      playerX < badItem.x + badItemWidth &&
      playerX + playerWidth > badItem.x &&
      playerY < badItem.y + badItemHeight &&
      playerY + playerHeight > badItem.y
    ) {
      hearts--;
      badItems.splice(i, 1); // Remove the collided bad item
    }
  }
}

// Reset item position and speed
function resetItems() {
  if (goodItems.length + badItems.length < maxItems) {
    var randomNum = Math.random();
    if (randomNum < 0.8) {
      // Spawn a good item (80% chance)
      var goodItem = {
        x: Math.random() * (canvas.width - goodItemWidth),
        y: -goodItemHeight,
        speed: itemSpeed
      };
      goodItems.push(goodItem);
    } else {
      // Spawn a bad item (20% chance)
      var badItem = {
        x: Math.random() * (canvas.width - badItemWidth),
        y: -badItemHeight,
        speed: itemSpeed
      };
      badItems.push(badItem);
    }
  }
}

// Update game objects and render
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);

  // Draw good items
  for (var i = 0; i < goodItems.length; i++) {
    var goodItem = goodItems[i];
    ctx.drawImage(goodItemImage, goodItem.x, goodItem.y, goodItemWidth, goodItemHeight);
    goodItem.y += goodItem.speed;
    if (goodItem.y > canvas.height) {
      goodItems.splice(i, 1); // Remove the off-screen good item
    }
  }

  // Draw bad items
  for (var i = 0; i < badItems.length; i++) {
    var badItem = badItems[i];
    ctx.drawImage(badItemImage, badItem.x, badItem.y, badItemWidth, badItemHeight);
    badItem.y += badItem.speed;
    if (badItem.y > canvas.height) {
      badItems.splice(i, 1); // Remove the off-screen bad item
    }
  }

  // Check player-item collision
  checkCollision();

  // Draw score
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);

  // Draw hearts
  for (var i = 0; i < hearts; i++) {
    var heartX = canvas.width - (i + 1) * (heartWidth + 10);
    var heartY = 10;
    ctx.drawImage(heartImage, heartX, heartY, heartWidth, heartHeight);
  }

  // Check if player lost all hearts
  if (hearts <= 0) {
    isGameOver = true;
    ctx.drawImage(gameOverImage, canvas.width / 2 - 150, canvas.height / 2 - 150, 300, 300);
    return; // Exit the update function
  }

  // Increase overall fall speed
  itemSpeed += fallAcceleration;

  // Spawn new items
  spawnCounter++;
  if (spawnCounter % 10 === 0) {
    resetItems();
  }

  requestAnimationFrame(update);
}

// Handle mouse movement
canvas.addEventListener("mousemove", function (event) {
  var rect = canvas.getBoundingClientRect();
  playerX = event.clientX - rect.left - playerWidth / 2;
});

// Start the game loop
resetItems();
update();
