export function getCourseLabel(code: string): string {
    if (!code) return 'Sem curso';
    return COURSES.find((c) => c.code === code)?.label ?? code;
}

export const COURSES: { code: string; label: string }[] = [
    { code: 'LEIC', label: 'Licenciatura Engenharia Informática e Computação (LEIC)' },
    { code: 'LEEC', label: 'Licenciatura Engenharia Eletrotécnica e de Computadores (LEEC)' },
    { code: 'LEM', label: 'Licenciatura Engenharia Mecânica (LEM)' },
    { code: 'LEC', label: 'Licenciatura Engenharia Civil (LEC)' },
    { code: 'LEQ', label: 'Licenciatura Engenharia Química (LEQ)' },
    { code: 'LEAmb', label: 'Licenciatura Engenharia do Ambiente (LEAmb)' },
    { code: 'LEMM', label: 'Licenciatura Engenharia Metalúrgica e de Materiais (LEMM)' },
    { code: 'LEIG', label: 'Licenciatura Engenharia Industrial e Gestão (LEIG)' },
    { code: 'LEF', label: 'Licenciatura Engenharia Física (LEF)' },
    { code: 'LEB', label: 'Licenciatura Engenharia Biomédica (LEB)' },
    { code: 'LCDE', label: 'Licenciatura Ciência e Engenharia de Dados (LCDE)' },
    { code: 'LDP', label: 'Licenciatura Design de Produto (LDP)' },
    { code: 'MEIC', label: 'Mestrado Engenharia Informática e Computação (MEIC)' },
    { code: 'MEEC', label: 'Mestrado Engenharia Eletrotécnica e de Computadores (MEEC)' },
    { code: 'MEM', label: 'Mestrado Engenharia Mecânica (MEM)' },
    { code: 'MEC', label: 'Mestrado Engenharia Civil (MEC)' },
    { code: 'MEQ', label: 'Mestrado Engenharia Química (MEQ)' },
    { code: 'MEAmb', label: 'Mestrado Engenharia do Ambiente (MEAmb)' },
    { code: 'MEMM', label: 'Mestrado Engenharia Metalúrgica e de Materiais (MEMM)' },
    { code: 'MEIG', label: 'Mestrado Engenharia Industrial e Gestão (MEIG)' },
    { code: 'MEF', label: 'Mestrado Engenharia Física (MEF)' },
    { code: 'MEB', label: 'Mestrado Bioengenharia (MEB)' },
    { code: 'MESHO', label: 'Mestrado Engenharia de Segurança e Higiene Ocupacionais (MESHO)' },
    { code: 'MESG', label: 'Mestrado Engenharia de Serviços e Gestão (MESG)' },
    { code: 'MM', label: 'Mestrado Multimedia (MM)' },
    { code: 'MIETE', label: 'Mestrado Inovação e Empreendedorismo Tecnológico (MIETE)' },
    { code: 'MEFRE', label: 'Mestrado Engenharia de Fontes Renováveis de Energia (MEFRE)' },
];