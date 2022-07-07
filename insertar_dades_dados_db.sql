use dados_model;

INSERT INTO jugadors(nom) VALUES
('Ana'),
('Francesc');

-- 0 Perd
-- 1 Guanyar
INSERT INTO partides (idjugador, resultat, dau1, dau2) VALUES
(1,0,3,6),
(1,0,2,1),
(1,0,1,5),
(1,0,3,4),
(2,1,1,6),
(2,0,2,1),
(2,0,1,5),
(2,1,3,4);