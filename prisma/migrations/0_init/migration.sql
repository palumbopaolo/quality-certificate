BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Orders] (
    [id] BIGINT NOT NULL,
    [orderNumber] VARCHAR(10) NOT NULL,
    [orderPartNumber] VARCHAR(5),
    [orderJobNumber] VARCHAR(1),
    [customerNumber] VARCHAR(20),
    [itemNumber] NVARCHAR(40),
    [itemOrderedQuantity] BIGINT,
    [supplierLotNumber] VARCHAR(10) NOT NULL,
    [customerItemReference] VARCHAR(200),
    [customerItemDescription] VARCHAR(100),
    [thickness] FLOAT(53),
    [grammage] FLOAT(53),
    [width] INT,
    [length] INT,
    [height] INT,
    [color] VARCHAR(50),
    [deliveryCustomerName] VARCHAR(100),
    [deliveryAddress] VARCHAR(100),
    [deliveryCity] VARCHAR(100),
    [printdate] DATE,
    CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

