export type Box={id:string;number:number;responsible:string;opening:number;status:'open'|'closed';created:string};
export type Movement={id:string;boxId:string;date:string;concept:string;project:string;amount:number;direction:'income'|'expense';document:'factura'|'boleta'|'recibo'|'ninguno';reference:string;payment:string;place:string;beneficiary:string;receipt:number|null;attachments:{id:string;name:string;file:string;mime:string}[]};
export const balance=(box:Box,items:Movement[])=>40000-items.filter(m=>m.boxId===box.id&&m.direction==='expense').reduce((s,m)=>s+m.amount,0);
export const receiptCode=(box:Box,n:number)=>`ER-ACHE-${String(box.number).padStart(3,'0')}-${String(n).padStart(2,'0')}`;
export const nextReceipt=(items:Movement[],boxId:string)=>Math.max(0,...items.filter(m=>m.boxId===boxId).map(m=>m.receipt||0))+1;
export const BOX_LIMIT=40000;
export const funding=(box:Box,items:Movement[])=>box.opening+items.filter(m=>m.boxId===box.id&&m.direction==='income').reduce((s,m)=>s+m.amount,0);
export const replenishment=(box:Box,_items:Movement[])=>Math.max(0,BOX_LIMIT-box.opening);
export function validateAmount(box:Box,items:Movement[],direction:string,amount:number){
 if(amount>BOX_LIMIT)throw new Error('Un movimiento no puede superar S/ 400.00. No se divide el comprobante entre cajas.');
 if(direction!=='expense')throw new Error('Caja chica solo admite gastos. La reposición se muestra como referencia de cabecera.');
 if(amount>balance(box,items))throw new Error('Los gastos de esta caja superarían S/ 400.00. Pasa el gasto completo a la siguiente caja.');
}
