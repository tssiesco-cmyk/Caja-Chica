-- Ejecutar en SQL Server Management Studio (SQL Server 2016 o posterior).
IF DB_ID(N'CajaChicaACHE') IS NULL CREATE DATABASE CajaChicaACHE;
GO
USE CajaChicaACHE;
GO
CREATE TABLE dbo.Cajas (
 Id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
 Numero int NOT NULL UNIQUE CHECK (Numero > 0),
 Responsable nvarchar(150) NOT NULL,
 SaldoInicial decimal(18,2) NOT NULL CHECK (SaldoInicial >= 0 AND SaldoInicial <= 400),
 Estado varchar(10) NOT NULL DEFAULT 'abierta' CHECK (Estado IN ('abierta','cerrada')),
 FechaCreacion date NOT NULL DEFAULT CONVERT(date,GETDATE()),
 ProximoRecibo int NOT NULL DEFAULT 1 CHECK (ProximoRecibo > 0),
 CajaAnteriorId uniqueidentifier NULL REFERENCES dbo.Cajas(Id)
);
CREATE TABLE dbo.Movimientos (
 Id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
 CajaId uniqueidentifier NOT NULL REFERENCES dbo.Cajas(Id),
 Fecha date NOT NULL,
 Concepto nvarchar(1000) NOT NULL,
 Proyecto nvarchar(100) NOT NULL DEFAULT '',
 Importe decimal(18,2) NOT NULL CHECK (Importe > 0 AND Importe <= 400),
 Tipo varchar(10) NOT NULL CHECK (Tipo = 'egreso'),
 Documento varchar(10) NOT NULL CHECK (Documento IN ('factura','boleta','recibo','ninguno')),
 Referencia nvarchar(100) NOT NULL DEFAULT '',
 MedioPago nvarchar(20) NOT NULL CHECK (MedioPago IN ('Efectivo','Transferencia','Yape','Plin')),
 Lugar nvarchar(100) NOT NULL DEFAULT 'Lima',
 RecibiDe nvarchar(150) NOT NULL DEFAULT 'IESCO S.A.C',
 NumeroRecibo int NULL,
 CreadoEn datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT CK_Recibo CHECK ((Documento='recibo' AND Tipo='egreso' AND NumeroRecibo IS NOT NULL AND NumeroRecibo>0) OR (Documento<>'recibo' AND NumeroRecibo IS NULL))
);
CREATE UNIQUE INDEX UX_ReciboPorCaja ON dbo.Movimientos(CajaId,NumeroRecibo) WHERE NumeroRecibo IS NOT NULL;
CREATE INDEX IX_Movimientos_Caja ON dbo.Movimientos(CajaId,CreadoEn);
CREATE TABLE dbo.Evidencias (
 Id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
 MovimientoId uniqueidentifier NOT NULL REFERENCES dbo.Movimientos(Id),
 NombreOriginal nvarchar(255) NOT NULL,
 Archivo nvarchar(255) NOT NULL UNIQUE,
 TipoMime varchar(100) NOT NULL,
 CreadoEn datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
-- Para asignar correlativos en el futuro repositorio SQL:
-- Abrir transacción y bloquear la caja con SELECT ... WITH (UPDLOCK,HOLDLOCK).
-- Verificar estado y saldo, tomar ProximoRecibo, incrementarlo e insertar
-- el movimiento dentro de la misma transacción. No usar MAX()+1 en producción.
-- Además, validar en esa transacción que SUM(Importe de gastos de la caja) <= 400.
-- Al crear la caja siguiente, cerrar la anterior, trasladar su saldo y mostrar
-- 400 - saldo trasladado como reposición de referencia. No registrar ingresos.
