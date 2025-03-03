# 7FlipCounter



- History  - eventuell Anstatt nächste Runde Button
nächste Runde Buttonm nach unten, unter den letzten Spieler.
- ng serve --configuration production
- http://localhost:4200/7FlipCounter



Valdrin
ist es besser beim Model Player den Score als [] zu Speichern oder,
immer gleich zusammenrechnen und als number zu Speichern?

passt das so mit namelist und dann erst player?

im Content.component AddPlayer...
result.forEach(playerName => {
this.gameService.createPlayer(playerName);
});
sollte so etwas nicht ins Service und dort dann erweitert.
