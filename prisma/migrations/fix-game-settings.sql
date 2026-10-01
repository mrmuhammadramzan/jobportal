-- Fix exploitable game settings — reset to sensible defaults
UPDATE platform_settings SET `value`='100'  WHERE `key`='game.winInterval';
UPDATE platform_settings SET `value`='10'   WHERE `key`='game.winPerStep';
UPDATE platform_settings SET `value`='1000' WHERE `key`='game.jackpotScore';
UPDATE platform_settings SET `value`='1.0'  WHERE `key`='game.jackpotMult';
UPDATE platform_settings SET `value`='1200' WHERE `key`='game.jackpotBonusScore';
UPDATE platform_settings SET `value`='1.2'  WHERE `key`='game.jackpotBonusMult';
UPDATE platform_settings SET `value`='false' WHERE `key`='game.randomSpeed';
