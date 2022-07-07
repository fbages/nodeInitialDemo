-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema dados_model
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema dados_model
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `dados_model`;
CREATE SCHEMA IF NOT EXISTS `dados_model` DEFAULT CHARACTER SET utf8 ;
USE `dados_model` ;

-- -----------------------------------------------------
-- Table `dados_model`.`jugadors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dados_model`.`jugadors` (
  `idjugador` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(45) NULL,
  `percentatge` INT NULL,
  `data_registre` DATE NULL,
  PRIMARY KEY (`idjugador`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `dados_model`.`partides`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dados_model`.`partides` (
  `idpartides` INT NOT NULL AUTO_INCREMENT,
  `idjugador` INT NULL,
  `resultat` INT NULL,
  `dau1` INT NULL,
  `dau2` INT NULL,
  PRIMARY KEY (`idpartides`),
  INDEX `id_jugador_idx` (`idjugador` ASC) VISIBLE,
  CONSTRAINT `id_jugador`
    FOREIGN KEY (`idjugador`)
    REFERENCES `dados_model`.`jugadors` (`idjugador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
