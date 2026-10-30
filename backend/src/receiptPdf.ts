import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import type PDFDocument from 'pdfkit';import type {Box,Movement} from './domain.js';import {receiptCode} from './domain.js';
export function drawReceipt(pdf:PDFKit.PDFDocument,m:Movement,b:Box){
 const logo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../frontend/public/iesco.png');
 pdf.lineWidth(1).strokeColor('#222222').rect(30,30,782,510).stroke();
 if(fs.existsSync(logo))pdf.image(logo,48,44,{fit:[172,68]});else pdf.font('Helvetica-Bold').fontSize(28).text('IESCO',48,55);
 pdf.fillColor('#111111').font('Helvetica').fontSize(12).text('Recibo Número: '+receiptCode(b,m.receipt!),470,63,{width:320,align:'right'});
 pdf.font('Helvetica-Bold').fontSize(17).text('RECIBO DE GASTOS',200,117,{width:440,align:'center'});
 pdf.fontSize(14).text('Total S/.',600,150,{width:90}).text((m.amount/100).toFixed(2),696,150,{width:90,align:'right'});
 pdf.font('Helvetica').fontSize(12).text('Lugar:  '+m.place,95,184,{width:330});pdf.text('Fecha:',450,184);pdf.rect(505,179,130,25).stroke();pdf.text(m.date.split('-').reverse().join('/'),512,185,{width:118,align:'center'});
 pdf.text('Recibí de ',95,217,{continued:true});pdf.font('Helvetica-Bold').text(m.beneficiary||'IESCO S.A.C',{width:600});
 pdf.font('Helvetica').text('La cantidad de:',95,244);pdf.font('Helvetica-Bold').fontSize(14).text('S/ '+(m.amount/100).toFixed(2),270,242);
 pdf.font('Helvetica').fontSize(12).text('Gastos por concepto de:',95,276,{width:170});
 const concept=m.concept.toUpperCase();let size=12;pdf.font('Helvetica');while(size>8){pdf.fontSize(size);if(pdf.heightOfString(concept,{width:470})<=88)break;size--}pdf.rect(270,270,515,112).stroke();pdf.text(concept,289,282,{width:477,height:90,align:'center',ellipsis:true});
 pdf.font('Helvetica').fontSize(12).text('Proyecto: ',95,405,{continued:true});pdf.font('Helvetica-Bold').text(m.project||'—');
 pdf.moveTo(95,481).lineTo(345,481).stroke();pdf.font('Helvetica').fontSize(11).text(b.responsible,95,490,{width:250,align:'center'});
 pdf.fontSize(8).fillColor('#6b7470').text('Firma del responsable',95,519,{width:250,align:'center'});
}
