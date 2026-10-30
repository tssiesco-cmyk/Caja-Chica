export function validateExpense(values:Record<string,string>,document:string){const errors:Record<string,string>={};
 if(!values.date||!/^\d{4}-\d{2}-\d{2}$/.test(values.date)||isNaN(Date.parse(values.date)))errors.date='Selecciona una fecha válida.';
 const amount=Number(values.amount);if(!Number.isFinite(amount)||amount<=0)errors.amount='Escribe un importe mayor a S/ 0.00.';else if(amount>400)errors.amount='El importe no puede superar S/ 400.00.';
 if((values.concept||'').trim().length<3)errors.concept='Describe el concepto del gasto (mínimo 3 caracteres).';
 if(document==='factura'&&!(values.reference||'').trim())errors.reference='Escribe la serie y el número de la factura.';
 if('place' in values&&!values.place.trim())errors.place='Indica el lugar del recibo.';
 if('beneficiary' in values&&!values.beneficiary.trim())errors.beneficiary='Indica de quién se recibió el dinero.';
 return errors;
}
