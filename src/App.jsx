import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  LayoutDashboard, GitBranch, Users, Search, Bell, Truck, Plane, Phone, Mail,
  MessageCircle, Calendar, MapPin, Building2, ChevronRight, X, Plus, AlertTriangle,
  TrendingUp, Clock, CheckCircle2, ArrowLeft, Filter, User, Briefcase
} from 'lucide-react';

const SEED_CLIENTS = [{"empresa": "DENTAL NORONHA", "cnpj": "23.524.480/0001-95", "segmento": "dental", "contato": "Ana Paula", "telefone": "42984458950", "timeline": [{"data": "2026-04-01", "nota": "Rosana - contato por telefone , vai cotar"}, {"data": "2026-07-07", "nota": "Liguei não consegui falar"}], "id": 1, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RAZZA ESPORTES", "cnpj": "13.640.789/0001-97", "segmento": "fabrica roupas esportivas", "contato": "Vitor", "telefone": "42999544048", "timeline": [{"data": "2026-04-02", "nota": "Rosana - contato por telefone"}], "id": 2, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DENTAL TONET", "cnpj": "72.041.080/0001-34", "segmento": "dental", "contato": "Julio", "telefone": "4232251882", "timeline": [{"data": "2026-04-06", "nota": "Rosana - contato por telefone"}], "id": 3, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TECNODRONES", "cnpj": "29.299.544/0001-88", "segmento": "drones", "contato": "Paulo", "telefone": "424141-5128", "timeline": [{"data": "2026-04-06", "nota": "Rosana - tem baterias - DG"}], "id": 4, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CYCLOTRONICS", "cnpj": "11.112.928/0001-84", "segmento": "peças bicicletas", "contato": "JAQUELINE", "telefone": "42988069370", "timeline": [{"data": "2026-04-07", "nota": "Rosana - fez contato fone e passamos e-mail"}], "id": 5, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PREMIERTROFEUS", "cnpj": "00.071.521/0001-30", "segmento": "trofeus e brindes", "contato": "MARCOS", "telefone": "4234225451", "timeline": [{"data": "2026-04-07", "nota": "Rosana - fez contato fone e passamos e-mail, eu pedi e-mail para atendimento, fez cotação"}], "id": 6, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "KADESCH CALÇADO SEGURANÇA - PGZ 02", "cnpj": "06.293.564/0001-46", "segmento": "calçados de segurança", "contato": "JOÃO CARLOS", "telefone": "42984045229", "timeline": [{"data": "2026-04-07", "nota": "NÃO ENTRAR EM CONTATO - CLIENTE PGZ02"}], "id": 7, "status": "Perdido", "etapa": "Perdido", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BR300", "cnpj": "09.206.076/0001-42", "segmento": "automatizador de portões", "contato": "Makely", "telefone": "42988916077", "timeline": [{"data": "2026-04-07", "nota": "Rosana - contato por telefone , vai cotar"}], "id": 8, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SUMATRA", "cnpj": "35.823.305/0001-88", "segmento": "roupas e acessores esporte", "contato": "Victor", "telefone": "42991272911", "timeline": [{"data": "2026-04-07", "nota": "Rosana - contato por telefone , vai cotar"}], "id": 9, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "KORINGA BOMBAS", "cnpj": "06.138.948/0001-94", "segmento": "bandas injetoras", "contato": "Bruno", "telefone": "42999811491", "timeline": [{"data": "2026-04-07", "nota": "Rosana - contato por telefone"}], "id": 10, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HENIPNAM/CASTRO", "cnpj": "09.205.845/0001-98", "segmento": "esteiras agricolas", "contato": "Efraim", "telefone": "42991650113", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 11, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "IPRINT GRAFICA", "cnpj": "23.647.255/0001-46", "segmento": "brindes", "contato": "Marlon", "telefone": "42988641080", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 12, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BOUWMAN/CASTRO", "cnpj": "79.440.152/0001-65", "segmento": "peças agricolas", "contato": "Thiago", "telefone": "42999549042", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 13, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BOUWMAN/PONTA GROSSA", "cnpj": "79.440.152/0008-31", "segmento": "peças agricolas", "contato": "Werick", "telefone": "42999320275", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 14, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SOCIDISCO", "cnpj": "91.005.447/0001-09", "segmento": "disco agricolas", "contato": "Luiz", "telefone": "42999284143", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 15, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CRIATIVA UNIFORMES", "cnpj": "50.282.394/0001-96", "segmento": "uniformes", "contato": "Sonia", "telefone": "42991328490", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 16, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "IRAN FAUSTIN", "cnpj": "39.988.450/0001-70", "segmento": "arcos /flexa", "contato": "Iran", "telefone": "42999109363", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}, {"data": "2026-06-30", "nota": "Iniciou os embarques"}], "id": 17, "status": "Ativo", "etapa": "Cliente Ativo", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BDM DIESEL", "cnpj": "10.957.705/0001-55", "segmento": "bombas injetoras", "contato": "Marcelo", "telefone": "42988916077", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 18, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DHL", "cnpj": "84.944.297/0001-33", "segmento": "auto peças", "contato": "Clisman", "telefone": "42988310989", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 19, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TW BRASIL", "cnpj": "04.567.439/0001-51", "segmento": "amostra de madeiras", "contato": "Alvaro", "telefone": "4230261099", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 20, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "FUNDAÇÃO ABC/CASTRO", "cnpj": "78.594.025/0001-58", "segmento": "amostra p/ analise", "contato": "Stheffany", "telefone": "4232338600", "timeline": [{"data": "2026-04-07", "nota": "Rosana fez contato"}], "id": 21, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CASTROLANDA", "cnpj": "76.108.349/0001-03", "segmento": "alimentos", "contato": "SAC/ MILENA", "telefone": "4232348000", "timeline": [{"data": "2026-04-08", "nota": "Luiz - contato fone e passei e-mail"}, {"data": "2026-04-23", "nota": "liguei, falei com Pedro de compras que me passou e-mail da Barbara do transporte. Enviei e-mail"}, {"data": "2026-05-20", "nota": "42-99133-0215 - Barbara"}, {"data": "42-99105-8723 - Cesar", "nota": "2026-07-08 00:00:00"}, {"data": "Visitei o escritorio adm em PG, Falei com Carla, logística só em Castro.", "nota": "2026-07-21 00:00:00"}], "id": 22, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MM MOVEIS", "cnpj": "77.500.049/0001-38", "segmento": "eletroeletronicos, moveis", "contato": "ANTONIO", "telefone": "4299722631", "timeline": [{"data": "2026-04-08", "nota": "Luiz - em viagem, pediu pra nos falarmos próxima semana"}, {"data": "2026-06-25", "nota": "Com Bruna, iniciou na logística agora. Estamos tratando sobre simulações para negociarmos o início dos embarques."}], "id": 23, "status": "Prospect", "etapa": "Negociação", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MAKITA", "cnpj": "45.865.920/0001-00", "segmento": "maquinas portáteis", "contato": "SAC / GUSTAVO", "telefone": "FONE / E-MAIL", "timeline": [{"data": "2026-04-08", "nota": "Luiz - contato fone e passei e-mail"}], "id": 24, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SUPRIPONTA", "cnpj": "57.654.871/0001-46", "segmento": "peças bicicletas", "contato": "Jessica", "telefone": "41998036338", "timeline": [{"data": "2026-04-08", "nota": "Rosana - contato por telefone"}], "id": 25, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HDEMBREAGENS", "cnpj": "26.554.075/0001-08", "segmento": "auto peças", "contato": "ÂNDREA", "telefone": "4235360473", "timeline": [{"data": "2026-04-09", "nota": "Rosana - fez contato fone e passamos e-mail"}], "id": 26, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ROLATREK", "cnpj": "04.982.569/0001-50", "segmento": "auto peças", "contato": "OSVALDO", "telefone": "FONE / E-MAIL", "timeline": [{"data": "2026-04-09", "nota": "Rosana - fez contato fone e passamos e-mail"}], "id": 27, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SCHIFFER", "cnpj": "80.220.890/0001-86", "segmento": "auto peças", "contato": "Valdemar", "telefone": "42999830153", "timeline": [{"data": "2026-04-09", "nota": "Rosana - contato por telefone"}], "id": 28, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PONTAMED", "cnpj": "02.816.696/0001-54", "segmento": "medicamnetos", "contato": "IVANILSON E JULIO", "telefone": "E-MAIL / WHATSS", "timeline": [{"data": "2026-04-10", "nota": "Luiz - Foi passado e-mail, aguardando visita. Visita dia 15/04 ,vai passar volumetria para apresetarmos proposta"}, {"data": "2026-05-01", "nota": "Iniciou os embarques"}, {"data": "2026-05-30", "nota": "Continua embarcando, porém ttivemos problemas na demora das entregas e algumas avarias"}], "id": 29, "status": "Ativo", "etapa": "Cliente Ativo", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DAF CAMINHÕES", "cnpj": "13.114.506/0001-73", "segmento": "montadora caminhão", "contato": "PAULO", "telefone": "E-MAIL / WHATSS", "timeline": [{"data": "2026-04-10", "nota": "Luiz - Foi passado whats não respondeu, foi passado e-mail. Retornou pedindo dados para participarmos do BID"}], "id": 30, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TETRA PAK BRASIL", "cnpj": "61.528.030/0001-60", "segmento": "embalagens", "contato": "SAC", "telefone": "E-MAIL", "timeline": [{"data": "2026-04-10", "nota": "Luiz - Respondido e-mail pedindo a pessoa de contato"}, {"data": "2026-04-23", "nota": "enviei e-mail cobrando o contato da logística"}], "id": 31, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SUPERTROCA", "cnpj": "59.269.016/0001-47", "segmento": "peças para cinema", "contato": "Ronaldo", "telefone": "42984043414", "timeline": [{"data": "2026-04-13", "nota": "Rosana - contato por telefone"}, {"data": "2026-04-25", "nota": "Fez alguns embarques"}], "id": 32, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DENTAL PROSPERA", "cnpj": "06.252.810/0001-11", "segmento": "dental", "contato": "Andressa", "telefone": "42998582287", "timeline": [{"data": "2026-04-13", "nota": "Rosana - contato por telefone"}, {"data": "2026-07-07", "nota": "Com Mariana, Andressa esta de licença. Falar pelo wahtss onde pedem cotação."}], "id": 33, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PONTAROLLO FEIJÃO", "cnpj": "73.417.735/0001-99", "segmento": "feijão - amostras", "contato": "Ana", "telefone": "42988194790", "timeline": [{"data": "2026-04-13", "nota": "Fez contato pelo nosso wahtss - disse que ligou no fixo dois dias e ninguém atendeu, veio até nós. Explicamos que somo outra loja"}, {"data": "2026-05-25", "nota": "Fez cotação para envio de mais amostras"}], "id": 34, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ROBOTBOX", "cnpj": "26.107.412/0001-19", "segmento": "brinquedos", "contato": "Evandro", "telefone": "42988303091", "timeline": [{"data": "2026-04-14", "nota": "Rosana - contato por telefone"}], "id": 35, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CASA NIX", "cnpj": "42.606.488/0001-45", "segmento": "artigos de cama mesa e banho", "contato": "Ruan", "telefone": "42999420430", "timeline": [{"data": "2026-04-14", "nota": "Rosana - contato por telefone"}], "id": 36, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Rosana", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CINEPRO", "cnpj": "18.199.200/0001-80", "segmento": "peças para cinema", "contato": "Luciano", "telefone": "42-99990-9334", "timeline": [{"data": "2026-04-14", "nota": "Visitamos, Luciano disse que usa correios, tem coleta automática e iria cotar conosco."}], "id": 37, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CALÇADOS CARTOM", "cnpj": "03.531.165/0001-88", "segmento": "calçados - Imbituva", "contato": "Marcel", "telefone": "42998460247", "timeline": [{"data": "2026-04-14", "nota": "Luiz - contato pelo Whass - Falei com Marcel via fone, vai passar volumetria para apresentarmos uma proposta - Atende a Carton e Crival"}, {"data": "2026-04-28", "nota": "Visitamos, Luiz e Rosana, não pode nos atender"}], "id": 38, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CALCADOS CRIVAL LTDA", "cnpj": "13.670.248/0001-01", "segmento": "calçados - Imbituva", "contato": "Marcel", "telefone": "42998460248", "timeline": [{"data": "2026-04-15", "nota": "Luiz - contato pelo Whass - Falei com Marcel via fone, vai passar volumetria para apresentarmos uma proposta - Atende a Carton e Crival"}], "id": 39, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "USUAL ETIQUETAS", "cnpj": "84.986.736/0001-70", "segmento": "rotulos e etiquetas", "contato": "Luiz", "telefone": "", "timeline": [{"data": "2026-04-22", "nota": "Rosana por telefone - Luiz e-mail com apresentação"}], "id": 40, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GRUPO PHILUS", "cnpj": "81.082.679/0001-07", "segmento": "engenharia", "contato": "Maria", "telefone": "", "timeline": [{"data": "2026-04-22", "nota": "Rosana por telefone - Luiz e-mail com apresentação"}], "id": 41, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "OESL AUTOMOTIVE BRASIL LTDA/CONTINENTAL", "cnpj": "55.251.107/0001-02", "segmento": "peças automotivas", "contato": "", "telefone": "(42) 3219-2300", "timeline": [{"data": "2026-04-23", "nota": "Visitei, peguei o telefone na portaria, porém não atende. Porteiro falou para fazer contato pelo site"}], "id": 42, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BRASLAR ELETRODOMESTICOS", "cnpj": "04.016.420/0001-17", "segmento": "fogões cooktop", "contato": "Rodrigo - Logística", "telefone": "42 998237926", "timeline": [{"data": "2026-04-23", "nota": "Visitei, Rodrigo passou que a empresa esta em mudanças e mostrou interesse na entrega de cooktop"}, {"data": "2026-05-25", "nota": "Foi passada a simulação de valores de frete"}, {"data": "2026-07-06", "nota": "Falei com Rodrigo, nesse momento não consegue usar devido ao valor do frete."}], "id": 43, "status": "Perdido", "etapa": "Perdido", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VOITH PAPER", "cnpj": "61.243.119/0001-80", "segmento": "equipamentos automação", "contato": "Andreia / Guilherme", "telefone": "42-32281010", "timeline": [{"data": "2026-04-23", "nota": "Visitei, foi passado contato da logística"}], "id": 44, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BELGOTEX DO BRASIL", "cnpj": "02.305.606/0001-60", "segmento": "pisos vinilicos", "contato": "Cleiton", "telefone": "cleiton.ferreira@belgotex.com.br", "timeline": [{"data": "2026-04-23", "nota": "Visitei, foi passado contato da logística"}], "id": 45, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "D-PROT EPI’S", "cnpj": "65.456.298/0001-94", "segmento": "EPI´S", "contato": "Igor Diniz", "telefone": "42-999375308/42999891101", "timeline": [{"data": "2026-04-28", "nota": "Visita Luiz e Rosana. Esta iniciando a dsitribuidora de EPIs, ficamos de enviar uma proposta"}], "id": 46, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TOTAL MED", "cnpj": "49.729.192/0001-60", "segmento": "medicamentos", "contato": "", "telefone": "(42) 98866-3773", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 47, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOCAÇÃO HOSPITALAR", "cnpj": "30.499.478/0001-79", "segmento": "equipamentos automação", "contato": "", "telefone": "(42) 98866-3773", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 48, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BLESS SEMIJOIAS", "cnpj": "08.275.693/0001-37", "segmento": "bijuterias", "contato": "", "telefone": "(42) 99960-7000", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 49, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BJÚ PONTA GROSSA", "cnpj": "42.942.978/0001-12", "segmento": "bijuterias", "contato": "", "telefone": "(42) 99957-7817", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 50, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MUNDO DA AMANDA BOLSAS", "cnpj": "11.191.286/0001-56", "segmento": "bolsas", "contato": "", "telefone": "(42) 99106-0242", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 51, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DELUXE BOLSAS E ACESSÓRIOS", "cnpj": "17.085.245/0001-61", "segmento": "bolsas", "contato": "", "telefone": "(42) 99964-3541", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 52, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOUCAS POR BOLSAS", "cnpj": "32.336.211/0001-96", "segmento": "bolsas", "contato": "", "telefone": "(42) 99112-3500", "timeline": [{"data": "2026-05-06", "nota": "Informativo whatss"}], "id": 53, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOJA EBENEZER LTDA", "cnpj": "52.252.278/0001-50", "segmento": "Distribuidor de calçados", "contato": "Lucas", "telefone": "42-988633807", "timeline": [{"data": "2026-05-14", "nota": "Luiz - visitei, vende pela Shopee, Amazom e Netshoes-em média 30 envios diariamente. Fiquei de passar tabela e ativar a conta corrente para faturar"}], "id": 54, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Luiz", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LADS STORE", "cnpj": "43.250.322/0001-00", "segmento": "roupas e calçados", "contato": "Gabriela", "telefone": "42-99969-8838", "timeline": [{"data": "2026-05-19", "nota": "Entrou em contato pelo whatss, liguei e falei com Gabriela, vende e-commerce, passou os valores da Jadlgo - 16,00, J & T - 14,00 - nosso valor espresso - 79,00 - usa o nuvemshop para integração de informação e cotações direto no site dela"}], "id": 55, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VPERECK AUTO PEÇAS - PGZ02", "cnpj": "08.990.607/0001-78", "segmento": "AUTO PEÇAS", "contato": "Arielson", "telefone": "42-99945-0017", "timeline": [{"data": "2026-05-21", "nota": "A pedido do Arielson visitei - reclamou de algumas situações com PGZ02 - avise que iria passar para a Azul."}], "id": 56, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MADERO", "cnpj": "13.783.221/0004-78", "segmento": "Alimentos", "contato": "Jean Ferreira", "telefone": "41-98893-6671", "timeline": [{"data": "2026-06-02", "nota": "Indicado por Lucimar - Falamos pelo wahts, ele pediu uma visita. Estou cobrando a data da visita"}], "id": 57, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Deragro", "cnpj": "82.417.593/0001-50", "segmento": "distrib. De insumos", "contato": "", "telefone": "42-3227-2727", "timeline": [{"data": "2026-06-18", "nota": "FOI VISITADO, NÃO TEM NECESSIDADE DO TRANSPORTE AÉREO"}], "id": 58, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HENNIPMAN", "cnpj": "29.959.265/0001-01", "segmento": "PRODUÇÃO", "contato": "DHIOGO", "telefone": "42-3232-2070", "timeline": [{"data": "2026-06-19", "nota": "Empresa para visitar"}], "id": 59, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "KURASHIKI DO BRASIL", "cnpj": "89.729.156/0004-64", "segmento": "PRODUÇÃO E EXPORT.", "contato": "", "telefone": "42-3229-2425", "timeline": [{"data": "2026-06-22", "nota": "NAO USA TRANSPORTE AEREO"}], "id": 60, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "INOCBRAS", "cnpj": "07.609.584/0001-46", "segmento": "COM. IMPORT. E EXPORTAÇÃO", "contato": "", "telefone": "42-99966-5035-OSCAR", "timeline": [{"data": "2026-06-22", "nota": "Empresa a visitar"}], "id": 61, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Concessionária Valtra - Agromob Valtra", "cnpj": "57.213.191/0001-97", "segmento": "Concessionária trator", "contato": "Geison / Klismam", "telefone": "42 9906-7432", "timeline": [{"data": "2026-06-25", "nota": "Luiz e Caetano - visitamos. Estamos finalizando a conta corrente para iniciar os embarques"}], "id": 62, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Chevrolet Cipauto", "cnpj": "06.105.496/0003-06", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "Anselmo", "telefone": "42-3219-6650", "timeline": [{"data": "2026-06-27", "nota": "foi visitado e mostrou interesse"}], "id": 63, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Savanas (Mercedez)", "cnpj": "24.706.364/0002-30", "segmento": "PEÇAS PARA CAMINHÕES", "contato": "Alexandre", "telefone": "42-2101-2300", "timeline": [{"data": "2026-06-27", "nota": "foi visitado mostrou interesse"}], "id": 64, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Massey Fergusson", "cnpj": "0.220.791/0001-02", "segmento": "REVENDA DE TRATORES", "contato": "Vitor", "telefone": "41-3552-0990", "timeline": [{"data": "2026-06-27", "nota": "foi visitado, não tem necessidade manda pela tx quando precisa!"}], "id": 65, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "JHON DEERE", "cnpj": "00.702.079/0001-00", "segmento": "MAQUINAS AGRICOLAS", "contato": "JULIANO", "telefone": "42-99837-0231", "timeline": [{"data": "2026-06-27", "nota": "foi visitdo, ficou com nosso contato e mostrou interesse!"}], "id": 66, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "KOREA TRATORES", "cnpj": "10.866.529/0006-50", "segmento": "IMPLEMENTOS AGRÍCOLAS", "contato": "JOSÉ Amilton", "telefone": "42-3227-3000", "timeline": [{"data": "2026-06-27", "nota": "foi visitado e já fez transporte com a Azul PGZ 02"}], "id": 67, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TRATORCASE", "cnpj": "08.641.686/0002-92", "segmento": "MAQUINAS AGRÍCOLAS", "contato": "FERNANDO", "telefone": "42-3239-6161", "timeline": [{"data": "2026-06-27", "nota": "não utilizam transporte aéreo"}], "id": 68, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TRATORNEW", "cnpj": "01.335.050/0001-92", "segmento": "REVENDA DE MAQ. AGRÍCOLAS", "contato": "MOISÉS", "telefone": "42-3219-1314", "timeline": [{"data": "2026-06-27", "nota": "não utilizam transporte aéreo"}], "id": 69, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "STARA MÁQUINAS AGRÍCOLAS", "cnpj": "91.495.499/0001-00", "segmento": "MAQUINAS AGRÍCOLAS", "contato": "JOAQUIM", "telefone": "54-3332-2800", "timeline": [{"data": "2026-06-27", "nota": "foi visitado,ainda não precisou do transporte aéreo,mais ficou interessdo caso necessite para o futuro!"}], "id": 70, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Hyundai Barigui", "cnpj": "07.461.763/0006-93", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "LEANDRO", "telefone": "42-3087-9164", "timeline": [{"data": "2026-07-02", "nota": "FOI VISITADO,MOSTROU INTERESSE!"}, {"data": "2026-07-07", "nota": "Havia agendado visita com Fernando hoje, pediu para aguardar o gerente voltar de férias. Entrar em contato dia 23/07"}], "id": 71, "status": "Prospect", "etapa": "Visita Agendada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CITROEN PROVENCE", "cnpj": "07.681.092/0001-61", "segmento": "REVENDA DE VEICULOS", "contato": "REINALDO", "telefone": "42-98835-9422", "timeline": [{"data": "2026-07-02", "nota": "FOI VISITADO, FICOU INTERESSADO!"}], "id": 72, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ELÉTRO IGUAÇU (STIHL)", "cnpj": "87.235.172/0001-22", "segmento": "FERRAMENTAS E PEÇAS", "contato": "PATRICK", "telefone": "42-3028-6992", "timeline": [{"data": "2026-07-02", "nota": "FOI VISITADO,MOSTROU INTERESSE"}], "id": 73, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "YAMAHA", "cnpj": "31.110.853/0003-71", "segmento": "PEÇAS PARA MOTOS", "contato": "EMERSON", "telefone": "42-3238-3003", "timeline": [{"data": "2026-07-02", "nota": "FOI VISITADO MOSTROU INTERESSE"}], "id": 74, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "UNIMED", "cnpj": "77.781.706/0001-62", "segmento": "medicamentos", "contato": "ROGER", "telefone": "42-3220-7000", "timeline": [{"data": "2026-07-02", "nota": "Não há necessidade, tem veículos da própria mpresa, e não depende do transpore aéreo"}], "id": 75, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Toyota Barigui", "cnpj": "31.264.770/0002-56", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "Marcos", "telefone": "4299162-8818", "timeline": [{"data": "2026-07-07", "nota": "foi visitado, falou que esse tipo de serviço é feito com o Marcio Francisco Rosa de Curitiba,vou tentar contato pelo email!"}], "id": 76, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Fiat Barigui", "cnpj": "77.025.708/0001-21", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "RENAN", "telefone": "41-99684-0716", "timeline": [{"data": "2026-07-07", "nota": "Foi visitado, mostrou interesse,mas acredita que será dificil utilizar nosso serviço!"}], "id": 77, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BYD Ponta Grossa", "cnpj": "02.446.766/0005-53", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "IZAIAS", "telefone": "4299603-1100", "timeline": [{"data": "2026-07-07", "nota": "Foi visitado, falou que como a empresa é nova na cidade ainda não tem necessidade, vou entrar em contato novamente em breve!"}], "id": 78, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MITSUBISHI", "cnpj": "04.982.217/0001-03", "segmento": "REVENDA E SERVIÇOS DE VEÍCULOS", "contato": "RIAN", "telefone": "4298891-9440", "timeline": [{"data": "2026-07-07", "nota": "foi visitado mostrou interesse,vou entrar em contato novamente no próximo mês!"}], "id": 79, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HONDA FANCAR", "cnpj": "11.747.606/0001-01", "segmento": "REVENDA E SERVIÇOS DE VEÍC.", "contato": "MARCOS", "telefone": "42-99937-4078", "timeline": [{"data": "2026-07-07", "nota": "foi visitado e mostrou interesse,ficou com o contato, mas em breve estarei entrando em contato!"}], "id": 80, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GWM", "cnpj": "63.031.712/0001-98", "segmento": "REVENDA DE VEÍCULOS", "contato": "ELLENN", "telefone": "42-9954-7190", "timeline": [{"data": "2026-07-07", "nota": "Foi visitado, mostrou interesse,ficou com o contato, mas em breve estarei entrando em contato novamente!"}], "id": 81, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GMAD", "cnpj": "81.750.978/0001-72", "segmento": "dtudo moveis e marcenaria", "contato": "PEDRO", "telefone": "42-99933-7100", "timeline": [{"data": "2026-07-08", "nota": "Foi visitado, ainda não precisou do serviço aéreo,mas ficou com o contato e vai repassar para outras lojas,em breve estarei fazendo contato novamente!"}], "id": 82, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GGPEL LIVRARIA E PAPELARIA", "cnpj": "03.568.176/0001-32", "segmento": "papelaria", "contato": "Emily/BARBÁRA", "telefone": "042-32291442/4299866-0154", "timeline": [{"data": "2026-07-08", "nota": "contato via whtass , Erica /foi visitado falei com a Bárbara, ficou interessada vou entrar em contato novamente,próximo mês!( CAETANO)"}], "id": 83, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Renaut Barigui", "cnpj": "01.304.124/0015-29", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "WILLIAN", "telefone": "4299117-1277", "timeline": [{"data": "2026-07-08", "nota": "foi visitado,mostrou interesse,vou entrar em contato novamente,próximo mês!"}], "id": 84, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GRUPO LELAK", "cnpj": "65.124.015/0001-07", "segmento": "MATERIAL HOSPITALAR", "contato": "FÁBIO", "telefone": "41-9155-7529", "timeline": [{"data": "2026-07-08", "nota": "Foi visitado e mostrou interesse,ficou com o contato,em breve estarei entrando em contato novamente!"}], "id": 85, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LUMED", "cnpj": "00.771.471/0001-01", "segmento": "DISTRIB. DE MEDICAMENTOS", "contato": "LUANA", "telefone": "42-3222-5762", "timeline": [{"data": "2026-07-08", "nota": "Foi visitado,ainda não precisou do transporte aéreo,mais ficou interessdo caso necessite para o futuro!"}], "id": 86, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PANVEL FARMÁCIAS", "cnpj": "92.665.611/0744-56", "segmento": "medicamentos", "contato": "MARISTELA", "telefone": "41-99163-9304", "timeline": [{"data": "2026-07-08", "nota": "Foi visitado e não depende do transporte aéreo,usao serviço térreo e já tem transortadora certa para as cotações!"}], "id": 87, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CIRURGIA VITAE", "cnpj": "22.727.533/0001-95", "segmento": "MATERIAL HOSPITALAR", "contato": "ADEMIR", "telefone": "42-99947-5787", "timeline": [{"data": "2026-07-08", "nota": "foi visitado mostrou interesse,vou entrar em contato novamente no próximo mês!"}], "id": 88, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PRP", "cnpj": "65.124.015/0001-07", "segmento": "MATERIAL HOSPITALAR", "contato": "EDINEI", "telefone": "42-98855-5550", "timeline": [{"data": "2026-07-08", "nota": "foi visitado, mostrou interesse, ficou de entrar em contato p/ cotação!"}], "id": 89, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RETIMAQ MAGGI", "cnpj": "77.138.113/0001-82", "segmento": "PEÇAS PARA CAMINHÕES", "contato": "ISÁIAS", "telefone": "42-99973-6346", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO E MOSTROU INTERESSE,VAI COTAR!"}], "id": 90, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CUNHADOS ACESSÓRIOS", "cnpj": "33.449.189/0001-53", "segmento": "ACESSÓRIOS P/CAMINHÕES", "contato": "ALLAN", "telefone": "42-98855-7739", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO DEPENDE BASTANTE DO TRANSPORTE AÉREO,VAI ENTRAR EM CONTATO PARA VER TABELA DE CIDADES ONDE ATENDEMOS ENTREGA!"}], "id": 91, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "AUTO PEÇAS ROTA", "cnpj": "52.325.080/0001-59", "segmento": "COM. DE PEÇAS", "contato": "CARLA", "telefone": "42-99126-8856", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO,MOSTROU INTERESSE,EM BREVE ENTRAREI EM CONTATO NOVAMENTE"}], "id": 92, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VOLMIX", "cnpj": "72.470.214/0001-32", "segmento": "PEÇAS P/ CAMINHÕES", "contato": "GUSTAVO", "telefone": "42-99842-7669", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO MOTROU INTERESSE, VAI ENTRAR EM CONTATO PARA COTAÇÕES!"}], "id": 93, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "INJEPEÇAS", "cnpj": "54.594.048/0001-02", "segmento": "COM. DE PEÇAS", "contato": "LUCAS", "telefone": "42-98890-1873", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO, JÁ PRECISOU DO TRANSPORTE AÉREO MAS NO MOMENTO A DEMANDA PRA ESSE TIPO DE SERVIÇO É POUCO!"}], "id": 94, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DRUGOVICH", "cnpj": "79.153.789/0004-13", "segmento": "REVENDA DE PEÇAS", "contato": "CARINE", "telefone": "42-3311-8000", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO, JÁ PRECISOU DO TRANSPORTE AÉREO, PRECISANDO NOVAMENTE VAI ENTRAR EM CONTATO PARA COTAÇÕES!"}], "id": 95, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VOLPARTS", "cnpj": "00.618.239/0006-34", "segmento": "PEÇAS P/ CAMINHÕES", "contato": "TIAGO", "telefone": "41-98875-2678", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO, MOSTROU INTERESSE, FICOU DE ENTRAR EM CONTATO P/COTAÇÃO!"}], "id": 96, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VOLMAX", "cnpj": "03.232.278/0001-82", "segmento": "PEÇAS P/ CAMINHÕES", "contato": "ZECA", "telefone": "42-98803-8444", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO E AINDA NÃO PRECISOU DO TRANSPORTE AÉREO,MAS SE TIVER NECESSIDADE VAI COTAR!"}], "id": 97, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "NICOSA", "cnpj": "75.600.635/0001-29", "segmento": "PEÇAS P/ MOTORES", "contato": "VALDECIR", "telefone": "42-3219-6700", "timeline": [{"data": "2026-07-14", "nota": "FOI VISITADO, AINDA NÃO PRECISOU DO SERVIÇO AÉREO,FICOU COM CONTATO E PRECISAR VAI COTAR COM A GENTE!"}], "id": 98, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CEFEQ", "cnpj": "00.472.957/0001-30", "segmento": "ferramentas", "contato": "Robson", "telefone": "42988325772", "timeline": [{"data": "2026-07-15", "nota": "visitei a empresa, porém não consegui falar pessoalmente com o Robson ou Paulo os responsáveis pela expedição, vou agendar visita !"}], "id": 99, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DIAFER", "cnpj": "04.798.677/0009-25", "segmento": "FERRAMENTAS", "contato": "KEVILIN", "telefone": "42-99154-7962", "timeline": [{"data": "2026-07-15", "nota": "AINDA NÃO PRECISOU DO TRANSPORTE AÉREO,FICOU COM O CONTATO SE PRECISAR VAI COTAR COM A GENTE!"}], "id": 100, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VALMOR PARALELO", "cnpj": "00.421.417/0001-28", "segmento": "AUTO PEÇAS", "contato": "VALMOR", "telefone": "42-3222-4647", "timeline": [{"data": "2026-07-15", "nota": "FOI VISITADO,AINDA NÃO PRECISOU DO TRANSPORTE AÉREO,MAS FICOU INTERESSADO P/ TRANSPORTE EM CIDADES PRÓXIMAS COM A PEGA ENTREGA"}], "id": 101, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PROCAR ACESSÓRIOS", "cnpj": "05.904.981/0001-15", "segmento": "AUTO PEÇAS", "contato": "CRISTIAN", "telefone": "42-99988-7557", "timeline": [{"data": "2026-07-15", "nota": "FOI VISITADO, JÁ TEM TRANSPORTADORAS CERTAS MAS SE PRECISAR ENTRA EM CONTATO!"}], "id": 102, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PAPELARIA FENIX", "cnpj": "08.836.817/0001-06", "segmento": "PAPEL. LIVRARIA", "contato": "ROSANE", "telefone": "42-99111-3436", "timeline": [{"data": "2026-07-15", "nota": "AINDA NÃO TEVE NECESSIDADE DO TRANSPORTE,FICOU COM O CONTATO SE CASO NECESSÁRIO!"}], "id": 103, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "POTÊNCIA DIESEL", "cnpj": "11.616.813/0001-27", "segmento": "OFICINA MEC.", "contato": "MELIK", "telefone": "42-3227-2614", "timeline": [{"data": "2026-07-15", "nota": "FOI VISITADO E MOSTROU INTERESSE,VAI ENTRAR EM CONTATO P/ SABER A TABELA  DE CIDADES QUE ATENDEMOS!"}], "id": 104, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "NAPEL", "cnpj": "19.367.936/0001-83", "segmento": "PEÇAS/PARA CAMINHÕES", "contato": "DIEGO", "telefone": "42-99875-1283", "timeline": [{"data": "2026-07-15", "nota": "FOI VISITADO, NO MOMENTO SÓ FAZ ENTREGA EM CIDADES PRÓXIMA E JÁ TEM EMPRESA CERTA P/ TRANSPORTE!"}], "id": 105, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "INICIATIVA CARTUCHOS", "cnpj": "46.745.283/0001-00", "segmento": "CARTUCHO P/ IMPRESSÃO", "contato": "JUNIOR", "telefone": "42-9918-9481", "timeline": [{"data": "2026-07-17", "nota": "Visitei a empresa, mostrou interesse, precisando vai cotar com a gente, no momento,faz as entregas em cidades próximas com a HGLOG, E Princesa dos Campos!"}], "id": 106, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "OPEL FERRAMENTAS", "cnpj": "09.261.250/0001-50", "segmento": "FERRAMENTAS", "contato": "JOÃO PAULO", "telefone": "42-99161-6190", "timeline": [{"data": "2026-07-17", "nota": "depende muito pouco do transporte, mais a demanda aqui na cidade, faz com motoboy!"}], "id": 107, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PPG PARAFUSOS", "cnpj": "05.250.137/0001-18", "segmento": "FERRAMENTAS", "contato": "RAFAEL", "telefone": "42-99954-4098", "timeline": [{"data": "2026-07-17", "nota": "visitei a loja conversei com o gerente, ele me passou o email do Rafael que cuida da parte da logistica, estarei consersando com ele!"}], "id": 108, "status": "Prospect", "etapa": "Visita Realizada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "DRESCH MÁQUINAS", "cnpj": "77.016.350/0001-70", "segmento": "SERRAS ELÉTRICAS", "contato": "ALEXANDRE", "telefone": "4298836-8634", "timeline": [{"data": "2026-07-17", "nota": "visitei a loja,no momento as entregas são para cidades próximas, que são atendidas pela Princesa dos campos e a Brassprex, ficu com o cantato precisando vai cotar com a gente!"}], "id": 109, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SAPATINHO", "cnpj": "08.915.468/0001-18", "segmento": "EQUIPAMENTOS", "contato": "WELINGTON", "telefone": "423222-2002", "timeline": [{"data": "2026-07-17", "nota": "Visitei a empresa, mostrou interesse, precisando vai cotar com a gente!"}], "id": 110, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GUIMARÃES", "cnpj": "78.728.375/0001-60", "segmento": "INFORMÁTICA", "contato": "LUCIANA", "telefone": "42-3222-5566", "timeline": [{"data": "2026-07-17", "nota": "Visitei a empresa, no momento são poucas as demandas com transporte, ficou com o contato precisando entra em contato para cotar!"}], "id": 111, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HGB", "cnpj": "80.824.709/0001-40", "segmento": "AUTO PEÇAS", "contato": "GABREL", "telefone": "42-999144-2017", "timeline": [{"data": "2026-07-20", "nota": "Entrei em contato por telefone, mostrou interesse em nosso trabalho, em breve estarei visitando pessoalmente para passar mais informações!"}], "id": 112, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MEGA PREMIUM", "cnpj": "13.072.185/0002-72", "segmento": "ELETRONICOS P/ MONITORAMENTO", "contato": "MAYCON", "telefone": "42-3227-1264", "timeline": [{"data": "2026-07-21", "nota": "contato por telefone com o seu gerente Osney, me passou contato do Maycon chamei no whats pra agendar visita"}], "id": 113, "status": "Prospect", "etapa": "Visita Agendada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RT TRUCK", "cnpj": "53.128.790/0001-51", "segmento": "AUTO PEÇAS", "contato": "BRUNO", "telefone": "42-99803-5411", "timeline": [{"data": "2026-07-21", "nota": "contato por telefone, vamos agendar uma visita!"}], "id": 114, "status": "Prospect", "etapa": "Visita Agendada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PLINIO FERRAMENTAS", "cnpj": "75.961.565/0001-34", "segmento": "FERRAMENTAS", "contato": "FERNANDO", "telefone": "42-3027-3000", "timeline": [{"data": "2026-07-21", "nota": "foi visitado,mostrou interesse,mas no momento sua maior necessidade é receber mercadorias, principalmente do estado de sp."}], "id": 115, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ASTROFIT", "cnpj": "46.038.989/0001-23", "segmento": "SUPLEMENTOS", "contato": "", "telefone": "42-98423-0866", "timeline": [{"data": "2026-07-21", "nota": "foi visitado, já tem empresas certas que fazem transportes pra ele, ficou com nosso contato em uma eventual precisão!"}], "id": 116, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "V8", "cnpj": "29.177.506/0001-52", "segmento": "SUPLEMENTOS", "contato": "", "telefone": "42-99148-2839", "timeline": [{"data": "2026-07-21", "nota": "foi visitado a empresa, já fez expedição para todo Brasil, mas no momento parou, devido a golpes com pagamentos por link!"}], "id": 117, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ORLOSKI", "cnpj": "22.381.384/0001-72", "segmento": "LIVROS TREINAMENTOS", "contato": "WESLEY", "telefone": "42-98441-4504", "timeline": [{"data": "2026-07-21", "nota": "foi visitado a empresa, escutamos reclamação da empresa que faz serviço pra eles, demora no atendimento, já entrou em contato com a gente, esperamos em breve estar cotando pra eles!"}], "id": 118, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "FASA", "cnpj": "04.994.734/0003-56", "segmento": "AUTO PEÇAS", "contato": "MOZARTH", "telefone": "43-3122-3301", "timeline": [{"data": "2026-07-21", "nota": "Luiz já tinha visitado,mas foi visitado novamente, foi boa conversa e mostrou interesse, aguardamos seu contato para cotações!"}], "id": 119, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BUNGE", "cnpj": "", "segmento": "DIVERSOS", "contato": "", "telefone": "", "timeline": [{"data": "2026-07-21", "nota": "Via linkedin enviei mensagem para o Iva Moreira - logistica"}], "id": 120, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BADANA COUTRY", "cnpj": "77.779.106/0001-60", "segmento": "MODA COUTRY", "contato": "DIEGO", "telefone": "42-99972-2214", "timeline": [{"data": "2026-07-21", "nota": "visitamos a empresa, falamos com funcionário, que nos passou contato do Diego, entramos em contato mais ainda não tivemos retorno, em breve visitaremos novamente!"}], "id": 121, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RODOPONTA", "cnpj": "04.669.397/0001-60", "segmento": "AUTO PEÇAS", "contato": "FABRÍCIO", "telefone": "42-99938-1387", "timeline": [{"data": "2026-07-23", "nota": "foi visitado, no momento suas entregas são em cidades proximas, mas se precisar entra em contato!"}], "id": 122, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "TRACKPEÇAS", "cnpj": "00.249.965/0001-12", "segmento": "PEÇAS", "contato": "CLAUDIO", "telefone": "42-99943-7682", "timeline": [{"data": "2026-07-23", "nota": "poucas vezes precisou de transportes fora da cidade, mas ficou com o contato caso precise!"}], "id": 123, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VASTA FERRAMENTAS", "cnpj": "23.349.272/0001-05", "segmento": "FERRAMENTAS", "contato": "ALEXANDRE", "telefone": "42-998564432", "timeline": [{"data": "2026-07-23", "nota": "já utilizou do transporte aéreo, mas suas expedição pra fora da cidade são poucas, não descartou a possibilidade de cotar com a gente!"}], "id": 124, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CIRITORNO", "cnpj": "03.680.364.0001-58", "segmento": "OFICINA MEC. REVENDA DE PEÇAS", "contato": "CIRO", "telefone": "42-99972-1434", "timeline": [{"data": "2026-07-23", "nota": "foi visitado, sua demanda de transportes é mais dentro da cidade, aí tem o serviço e motoboy, muito difícil exportar pra outra cidade,mas ficou com contato se precisar!"}], "id": 125, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VOLTEC", "cnpj": "13.700.390/0001-54", "segmento": "COMERCIO DE PEÇAS", "contato": "ANTONIO", "telefone": "42-3236-0266", "timeline": [{"data": "2026-07-23", "nota": "mostrou intteresse, mas é muito difícil expedição para outras cidades!"}], "id": 126, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CNE MMF", "cnpj": "33.905.643/0001-33", "segmento": "CARDÃNS", "contato": "EDGAR", "telefone": "42-99163-2152", "timeline": [{"data": "2026-07-23", "nota": "Ja utilizou do transporte aéreo e me informou q sempre aparece esse tipo de expedição, ficou com o contato para cotação!"}], "id": 127, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MAGRÃO DIESEL", "cnpj": "64.450.401/0001-26", "segmento": "PEÇAS P/ CAMINHÕES", "contato": "RENATA", "telefone": "44-9992-4165", "timeline": [{"data": "2026-07-23", "nota": "mostrou interesse, informou que sempre estão precisando do transporte mais rápido!"}], "id": 128, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RETIFICA NOVO HORIZONTE", "cnpj": "07.001.718/0001-41", "segmento": "RETIFICA E PEÇAS P/MOTORES", "contato": "DANILO", "telefone": "42-98403-8149", "timeline": [{"data": "2026-07-23", "nota": "mostrou interesse, quando precisar vai cotar com a gente!"}], "id": 129, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "AUDEME", "cnpj": "82.368.671/0001-74", "segmento": "PEÇAS", "contato": "MARCOS", "telefone": "42-99991--0575", "timeline": [{"data": "2026-07-23", "nota": "mostrou interesse, vai entrar em contato com a loja pra ver a tabela de cidades onde antendemos!"}], "id": 130, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VIDA NATURAL", "cnpj": "26.066.146/0001-23", "segmento": "PRODUTOS NATUTAIS", "contato": "FERNANDO", "telefone": "42-99857-3711", "timeline": [{"data": "2026-07-23", "nota": "mostrou interesse, vai entrar em contato pra ver cidades onde atendemos e valores!"}], "id": 131, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "VELOPEÇAS", "cnpj": "00.739.473/0001-05", "segmento": "PEÇAS", "contato": "JOÃO", "telefone": "42-99959-1566", "timeline": [{"data": "2026-07-23", "nota": "seu transportes é mais para cidades visinhas, já tem transportadora certa, mas não descartou em cotar com a gente!"}], "id": 132, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RETITURBO", "cnpj": "00.299.100/0001-60", "segmento": "PEÇAS", "contato": "THIAGO", "telefone": "42-99833-8614", "timeline": [{"data": "2026-07-23", "nota": "mostrou interesse,assim que precisar estará cotando com a gente!"}], "id": 133, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "RR. MANGUEIRAS", "cnpj": "08.645.026/0002-80", "segmento": "MANGUEIRAS HIDRÁUL.", "contato": "JAIR", "telefone": "42-99932-0378", "timeline": [{"data": "2026-07-23", "nota": "São poucas as demandas para outras cidades, mas mostrou interesse precisando entra em contato p/ cotar!"}], "id": 134, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MAGFLEX", "cnpj": "36.874.530/0001-06", "segmento": "MANGUEIRAS HIDRÁUL.", "contato": "LUCIANO", "telefone": "42-99954-0000", "timeline": [{"data": "2026-07-23", "nota": "são poucas suas expedições p/ outras cidades,mas ficou com o contato e precisando vai cotar com a gente!"}], "id": 135, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "SCHIMANDEIRO COUTRY", "cnpj": "04.611.849/0002-33", "segmento": "MODA COUTRY", "contato": "RONILZE", "telefone": "42-99923-7153", "timeline": [{"data": "2026-07-28", "nota": "Sempre tem expedições para outras regiões,mas já tem empresa que atende, reclamou da demora da entrega, e não descartou cotar com a gente!"}], "id": 136, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GR DISTRIB. DE COSMÉTICOS LTDA", "cnpj": "17.570.234/0001-77", "segmento": "COSMÉTICOS", "contato": "", "telefone": "42-3028-6668", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 137, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PG flex", "cnpj": "36.874.530/0001-06", "segmento": "mangueiras e conexões", "contato": "", "telefone": "whatsap - 42-4141-0012", "timeline": [{"data": null, "nota": "foi visitado, já tem empresas certas que fazem transportes pra ele, ficou com nosso contato em uma eventual precisão!"}], "id": 138, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Ford Fancar", "cnpj": "05.677.629/0003-56", "segmento": "CONCESSIONÁRIA DE VEÍULOS", "contato": "", "telefone": "42-3026-6000", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 139, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Cotrasa Veículos ( scania)", "cnpj": "24.951.802/0006-50", "segmento": "VEÍCULOS E SERVIÇOS", "contato": "", "telefone": "42-3239-6600", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 140, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Mac Ponta Trucks", "cnpj": "16.671.210/0001-41", "segmento": "MECANICA DE CAMINHÕES", "contato": "", "telefone": "42-3220-0200", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 141, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "Podium (Matriz)", "cnpj": "27.040.055/0001-81", "segmento": "REVENDA DE VEÍCULOS", "contato": "ERICSSON", "telefone": "42-99131-4329", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 142, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "HAIAT BAZZI LTDA", "cnpj": "07.419.1080001-62", "segmento": "PRODUTOS ODONTOLÓGICOS", "contato": "", "telefone": "41-99538-1382", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 143, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MULTITRUCK", "cnpj": "50.216.219/0001-09", "segmento": "AUTO PEÇAS", "contato": "", "telefone": "42-99804-2156", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 144, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MASA DISTRIBUIDORA", "cnpj": "75.525.608/0001-60", "segmento": "AUTO PEÇAS", "contato": "", "telefone": "42-2102-1447", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 145, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MARIENTAL", "cnpj": "31.113.383/0001-38", "segmento": "INSUMOS AGRIC. FERTILIZANTES", "contato": "", "telefone": "42-99825-2225", "timeline": [{"data": null, "nota": "EMPRESA A VISISTAR"}], "id": 146, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "PROTECTA", "cnpj": "80.551.211/0001-51", "segmento": "PRODUTOS AGRÍCOLAS", "contato": "", "telefone": "42-3027-3277", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 147, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "X BRI", "cnpj": "", "segmento": "", "contato": "", "telefone": "", "timeline": [{"data": null, "nota": "XBRI Pneus, R. Ricardo Lustosa Ribas, 160 - Estrela, Ponta Grossa - PR, 84040-140"}], "id": 148, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ÍONS FARMA", "cnpj": "46.308.600/0001-12", "segmento": "PRODUT. FARMACEUTICO", "contato": "", "telefone": "42-3223-2069", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 149, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CENTRO DE ABAST.FARMACÊUTICO", "cnpj": "76.175.884/0001-87", "segmento": "medicamentos", "contato": "", "telefone": "42-3220-1000", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 150, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GIGATRONIC", "cnpj": "21.102.570/0001-62", "segmento": "CAMERAS E ALARMES", "contato": "", "telefone": "42-3243-1111", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 151, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CENTER TRUCK", "cnpj": "47.923.819/0001-94", "segmento": "PEÇAS E REFRIGERAÇÃO", "contato": "", "telefone": "42-99996-9593", "timeline": [{"data": null, "nota": "EMPRESA A VISITAR"}], "id": 152, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MIL CORES", "cnpj": "01.865.628/0001-12", "segmento": "ROUPAS", "contato": "LEON", "telefone": "4299121-1469", "timeline": [{"data": "2026-07-28", "nota": "foi visitado a loja,falei com a gerente, falou das necessidades da loja e passou contato do rapaz da lojistíca,em breve farei nova visita!"}], "id": 153, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BOLLENA", "cnpj": "24.845.592/0001-00", "segmento": "UNIFORMES", "contato": "BETO", "telefone": "42-99958-3871", "timeline": [{"data": "2026-07-28", "nota": "visitei a empresa, suas expedições sõ poucas e mais para cidades visinhas, depende bastante de motoboy, ficou com contato precisando entra em contato para cotar!"}], "id": 154, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ARTSILK", "cnpj": "05.272.517/0001-53", "segmento": "ROUPAS UNIFORMES", "contato": "PÂMELA", "telefone": "42-99812-5934", "timeline": [{"data": "2026-07-28", "nota": "empresa foi visitado, dependem de transporte para outras regiões, já tem umas empresas de transp. Certas, mas reclamaram que há demora pra responder, precisando vão cotar com a gente!"}], "id": 155, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "GUAÍRA", "cnpj": "47.048.336/0001-98", "segmento": "UNIFORMES", "contato": "SILVIO", "telefone": "42-3225-0242", "timeline": [{"data": "2026-07-28", "nota": "Innformou que seus clientes são todos da cidade, e sua maior necessidade é mais em receber mercadorias!"}], "id": 156, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CASA DOS UNIFORMES", "cnpj": "18.929.426/0001-90", "segmento": "UNIFORMES", "contato": "MIRIAN", "telefone": "42-3087-0422", "timeline": [{"data": "2026-07-28", "nota": "tem poucas expedições para outras cidades, mas não descartou cotar com a gente assim que precisar"}], "id": 157, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ATACADÃO DOS UNIFORMES", "cnpj": "27.907.067/0001-60", "segmento": "UNIFORMES", "contato": "FABIANA", "telefone": "42-99911-1498", "timeline": [{"data": "2026-07-28", "nota": "Ja utilizou do transporte aéreo e me informou q sempre aparece esse tipo de expedição, ficou com o contato para cotação!"}], "id": 158, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOJAS TANIA", "cnpj": "05.834.259/0001-51", "segmento": "UNIFORMES", "contato": "FABÍOLA", "telefone": "42-3223-1346", "timeline": [{"data": "2026-07-28", "nota": "informou que a loja tem pouco tempo de existência por esse motivo seus clientes são todos da cidade!"}], "id": 159, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "STAMPA DIVINA", "cnpj": "18.883.296/0001-00", "segmento": "ROUPAS E VESTUÁRIO", "contato": "Ana Paula", "telefone": "42-98804-0891", "timeline": [{"data": "2026-07-27", "nota": "contato por telefone, pediu tabela de regiões onde atendemos!"}], "id": 160, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "BRANDS OUTLET", "cnpj": "42.596.485/0001-78", "segmento": "ROUPAS E ACESSÓR.", "contato": "ANY", "telefone": "42-99812-5934", "timeline": [{"data": "2026-07-28", "nota": "tem dependência do transporte, mas já tem empresas que faz o serviço, ficou com o contato e não descartou cotar com a gente!"}], "id": 161, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ATACADO LOTINHO", "cnpj": "31271.887/0001-86", "segmento": "ROUPAS E UNIFORMES", "contato": "JANE", "telefone": "42-99919-1102", "timeline": [{"data": "2026-07-31", "nota": "JA utilizou do transporte aéreo e me informou q sempre aparece esse tipo de expedição, ficou com o contato para cotação!"}], "id": 162, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ROLÊ CONFECÇÕES", "cnpj": "20.549.981/0001-38", "segmento": "CONFECÇÇOES ROUPAS", "contato": "LEODIR", "telefone": "42-99065165", "timeline": [{"data": "2026-07-31", "nota": "ficou interessado, já mandou mensagem pra loja pra saber quais cidades atendemos!"}], "id": 163, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LIFAGAVS CONFECÇÕES", "cnpj": "10.765.610/0001-30", "segmento": "ROUPAS", "contato": "JULIANA", "telefone": "42-99808-5942", "timeline": [{"data": "2026-07-31", "nota": "ainda não utilizou do transporte aéreo, suas expedições são  para  cidades próximas!"}], "id": 164, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "CASA BONSUCESSO", "cnpj": "77.498.442/0001-34", "segmento": "ROUPAS E CONFECÇÕES", "contato": "ANTONINHO", "telefone": "42-99950-0262", "timeline": [{"data": "2026-07-31", "nota": "mostrou interesse e informou que sempre depende de transporte para outras regiões!"}], "id": 165, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MAGDA ATACADO", "cnpj": "03.471.920/0001-86", "segmento": "ROUPAS E ENXOVAIS", "contato": "EMERSON", "telefone": "42-97400-1254", "timeline": [{"data": "2026-07-31", "nota": "ficou interessado, pediu mais informações sobre quais cidades atendemos!"}], "id": 166, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "MALHARIAS OLING", "cnpj": "82.436.106/0001-05", "segmento": "MALHAS", "contato": "BRUNA", "telefone": "42-3239-6258", "timeline": [{"data": "2026-07-31", "nota": "já utilizou do transporte aéreo com a Azul do centro e reclamou da demora no atendimento, quando precisar vai cotar com a gente!"}], "id": 167, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LELOS MIX", "cnpj": "34.717.619/0001-33", "segmento": "VESTUÁRIO", "contato": "RODRIGO", "telefone": "42-99862-3436", "timeline": [{"data": "2026-07-31", "nota": "informou que ainda são poucas suas expedições,mas precisando vai cotar com a gente!"}], "id": 168, "status": "Prospect", "etapa": "Cotação Enviada", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOJAS FABIANA", "cnpj": "07.340.914/0001-40", "segmento": "ROUPAS E VESTUÁRIO", "contato": "MÁRCIA", "telefone": "42-9919-1881", "timeline": [{"data": "2026-07-31", "nota": "informou que suas expedições ainda são poucas, mas vai precisar nos próximos dias para mandar umas malas para o Rio de Janeiro!"}], "id": 169, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "LOOK BACANA", "cnpj": "", "segmento": "ROUPAS", "contato": "ELISÂNGELA", "telefone": "42-99942-6737", "timeline": [{"data": "2026-07-31", "nota": "por enquanto suas expedições são aqui pra ciades próximas, utiliza motoboy,mas precisando vai entrar em contato!"}], "id": 170, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}, {"empresa": "ULTRAPACK", "cnpj": "07.597.774/0001-90", "segmento": "EMBALAGENS", "contato": "LUCAS", "telefone": "42-99978-0085", "timeline": [{"data": "2026-07-31", "nota": "falei com a atendente, me passou o contato precisa agendar pra falar com o Lucas!"}], "id": 171, "status": "Prospect", "etapa": "Primeiro Contato", "vendedor": "Não informado", "cidade": "", "estado": "PR", "valorPotencial": 0, "proximaAcao": ""}];

const STAGES = [
  { key: 'Lead', label: 'Lead', color: '#8C93A6', icon: '01', prazo: 3 },
  { key: 'Primeiro Contato', label: 'Primeiro Contato', color: '#2E5EAA', icon: '02', prazo: 5 },
  { key: 'Visita Agendada', label: 'Visita Agendada', color: '#3E7CB1', icon: '03', prazo: 7 },
  { key: 'Visita Realizada', label: 'Visita Realizada', color: '#4C9F70', icon: '04', prazo: 5 },
  { key: 'Cotação Enviada', label: 'Cotação Enviada', color: '#F5A524', icon: '05', prazo: 7 },
  { key: 'Negociação', label: 'Negociação', color: '#E8871E', icon: '06', prazo: 10 },
  { key: 'Cliente Ativo', label: 'Cliente Ativo', color: '#1C7C54', icon: '07', prazo: 0 },
  { key: 'Perdido', label: 'Perdido', color: '#B0463C', icon: '08', prazo: 0 },
];
const stageOf = (key) => STAGES.find(s => s.key === key) || STAGES[0];

const STATUS_COLOR = {
  'Ativo': '#1C7C54', 'Prospect': '#2E5EAA', 'Perdido': '#B0463C', 'Recuperado': '#F5A524'
};

function lastContactDate(client) {
  if (!client.timeline.length) return null;
  const dates = client.timeline.map(t => t.data).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}
function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.floor((now - d) / 86400000);
}
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const [y,m,d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
function uid() { return Math.random().toString(36).slice(2, 10); }

export default function CRMApp() {
  const [clients, setClients] = useState(() => SEED_CLIENTS.map(c => ({
    ...c,
    razaoSocial: c.empresa, nomeFantasia: c.empresa, ie: '', endereco: '', cep: '',
    email: '', whatsapp: c.telefone, site: '', instagram: '', linkedin: '',
    transportadoraAtual: '', concorrentes: '', tipoOperacao: '', volumeMensal: '',
    modal: 'Rodoviário', necessidade: '', dores: '', objecoes: '', diferenciais: '',
    probabilidade: c.status === 'Ativo' ? 90 : c.status === 'Perdido' ? 0 : 30,
  })));
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterSegmento, setFilterSegmento] = useState('Todos');

  const selected = clients.find(c => c.id === selectedId);

  const segmentos = useMemo(() => {
    const s = new Set(clients.map(c => c.segmento).filter(Boolean));
    return ['Todos', ...Array.from(s).sort()];
  }, [clients]);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [c.empresa, c.contato, c.telefone, c.segmento, c.cnpj, c.vendedor]
        .some(f => (f || '').toLowerCase().includes(q));
      const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus;
      const matchesSeg = filterSegmento === 'Todos' || c.segmento === filterSegmento;
      return matchesSearch && matchesStatus && matchesSeg;
    });
  }, [clients, search, filterStatus, filterSegmento]);

  function updateClient(id, patch) {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }
  function addTimelineEntry(id, nota) {
    if (!nota.trim()) return;
    const today = new Date().toISOString().slice(0,10);
    setClients(prev => prev.map(c => c.id === id
      ? { ...c, timeline: [...c.timeline, { data: today, nota }] }
      : c));
  }
  function openClient(id) { setSelectedId(id); setView('detalhe'); }

  const kpis = useMemo(() => {
    const ativos = clients.filter(c => c.status === 'Ativo').length;
    const prospects = clients.filter(c => c.status === 'Prospect').length;
    const perdidos = clients.filter(c => c.status === 'Perdido').length;
    const recuperados = clients.filter(c => c.status === 'Recuperado').length;
    const cotacoes = clients.filter(c => c.etapa === 'Cotação Enviada' || c.etapa === 'Negociação').length;
    const totalInteracoes = clients.reduce((s,c) => s + c.timeline.length, 0);
    const taxaConversao = clients.length ? Math.round((ativos / clients.length) * 1000) / 10 : 0;
    return { ativos, prospects, perdidos, recuperados, cotacoes, totalInteracoes, taxaConversao, total: clients.length };
  }, [clients]);

  const alerts = useMemo(() => {
    return clients
      .filter(c => c.status !== 'Perdido')
      .map(c => ({ c, last: lastContactDate(c), days: daysSince(lastContactDate(c)) }))
      .filter(x => x.days === null || x.days >= 30)
      .sort((a,b) => (b.days ?? 999) - (a.days ?? 999))
      .slice(0, 12);
  }, [clients]);

  const segChartData = useMemo(() => {
    const map = {};
    clients.forEach(c => { const k = c.segmento || 'Outros'; map[k] = (map[k]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value}));
  }, [clients]);

  const stageChartData = useMemo(() => {
    return STAGES.map(s => ({ name: s.label, value: clients.filter(c => c.etapa === s.key).length, color: s.color }));
  }, [clients]);

  const vendedorData = useMemo(() => {
    const map = {};
    clients.forEach(c => { const k = c.vendedor || 'Não informado'; map[k] = (map[k]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value}));
  }, [clients]);

  const navItems = [
    { key: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { key: 'funil', label: 'Funil Comercial', icon: GitBranch },
    { key: 'clientes', label: 'Clientes', icon: Users },
    { key: 'followup', label: 'Follow-up', icon: Bell, badge: alerts.length },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#F5F6F8', minHeight: '100vh', color: '#101828' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D3D7DE; border-radius: 4px; }
        input, select, textarea { font-family: 'Inter', sans-serif; }
        .card-hover { transition: transform .15s ease, box-shadow .15s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,24,40,0.08); }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* SIDEBAR */}
        <aside style={{ width: 236, background: '#101828', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #1F2937' }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#F5A524,#E8871E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#101828" />
            </div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>ROTA CRM</div>
              <div style={{ fontSize: 10, color: '#8C93A6', letterSpacing: 0.5 }}>TRANSPORTE & LOGÍSTICA</div>
            </div>
          </div>
          <nav style={{ padding: '16px 10px', flex: 1 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = view === item.key || (view === 'detalhe' && item.key === 'clientes');
              return (
                <button key={item.key} onClick={() => setView(item.key)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    marginBottom: 4, borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: active ? '#1E293B' : 'transparent', color: active ? '#fff' : '#A6ADBB',
                    fontSize: 13.5, fontWeight: active ? 600 : 500, position: 'relative',
                    borderLeft: active ? '3px solid #F5A524' : '3px solid transparent'
                  }}>
                  <Icon size={16} />
                  {item.label}
                  {item.badge > 0 && (
                    <span style={{ marginLeft: 'auto', background: '#B0463C', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: 16, borderTop: '1px solid #1F2937', fontSize: 11, color: '#5B6472' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: 4 }}><User size={12}/> Perfil: Gestor Comercial</div>
            {clients.length} empresas na base
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* TOPBAR */}
          <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{ position: 'relative', flex: '0 1 380px' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#8C93A6' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar empresa, contato, telefone, segmento..."
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#2E5EAA'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#5B6472' }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
            </div>
          </div>

          <div style={{ padding: 28 }}>
            {view === 'dashboard' && <Dashboard kpis={kpis} segChartData={segChartData} stageChartData={stageChartData} vendedorData={vendedorData} alerts={alerts} openClient={openClient} setView={setView} />}
            {view === 'funil' && <Funil clients={filtered} updateClient={updateClient} openClient={openClient} search={search} setSearch={setSearch} />}
            {view === 'clientes' && <ClienteLista clients={filtered} openClient={openClient} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filterSegmento={filterSegmento} setFilterSegmento={setFilterSegmento} segmentos={segmentos} total={clients.length} />}
            {view === 'detalhe' && selected && <ClienteDetalhe client={selected} updateClient={updateClient} addTimelineEntry={addTimelineEntry} setView={setView} />}
            {view === 'followup' && <FollowUp alerts={alerts} openClient={openClient} clients={clients} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div className="card-hover" style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #ECEDF0', flex: 1, minWidth: 150 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 11.5, color: '#8C93A6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
        {Icon && <Icon size={15} color={color || '#8C93A6'} />}
      </div>
      <div className="font-display" style={{ fontSize: 28, fontWeight: 700, marginTop: 6, color: color || '#101828' }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: '#8C93A6', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ kpis, segChartData, stageChartData, vendedorData, alerts, openClient, setView }) {
  const PALETTE = ['#2E5EAA','#F5A524','#1C7C54','#B0463C','#8C93A6','#3E7CB1','#E8871E','#4C9F70'];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Painel Comercial</div>
        <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Visão geral da carteira, funil e desempenho da equipe</div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <KpiCard label="Clientes Ativos" value={kpis.ativos} color="#1C7C54" icon={CheckCircle2} sub={`${kpis.total} empresas na base`} />
        <KpiCard label="Prospects" value={kpis.prospects} color="#2E5EAA" icon={TrendingUp} sub="em prospecção ativa" />
        <KpiCard label="Perdidos" value={kpis.perdidos} color="#B0463C" icon={AlertTriangle} sub="oportunidades encerradas" />
        <KpiCard label="Cotações em aberto" value={kpis.cotacoes} color="#F5A524" icon={Briefcase} sub="aguardando decisão" />
        <KpiCard label="Taxa de conversão" value={`${kpis.taxaConversao}%`} color="#101828" icon={GitBranch} sub="lead → cliente ativo" />
        <KpiCard label="Interações registradas" value={kpis.totalInteracoes} color="#101828" icon={Phone} sub="ligações, visitas, e-mails" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Funil Comercial</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 14 }}>Distribuição de empresas por etapa</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={stageChartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11.5, fill: '#5B6472' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F5F6F8' }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {stageChartData.map((d,i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Top Segmentos</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 10 }}>Empresas por segmento de atuação</div>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={segChartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                {segChartData.map((d,i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {segChartData.slice(0,6).map((d,i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#5B6472' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: PALETTE[i % PALETTE.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Volume por Vendedor</div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 14 }}>Empresas trabalhadas por responsável</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vendedorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2E5EAA" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Alertas Inteligentes</div>
            <button onClick={() => setView('followup')} style={{ fontSize: 11.5, color: '#2E5EAA', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ver todos →</button>
          </div>
          <div style={{ fontSize: 12, color: '#8C93A6', marginBottom: 10 }}>Clientes sem contato há 30+ dias</div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {alerts.slice(0,6).map(({c, days}) => (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.empresa}</div>
                  <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.segmento}</div>
                </div>
                <div style={{ fontSize: 11, color: '#B0463C', fontWeight: 700, background: '#FBEAE7', padding: '2px 8px', borderRadius: 20 }}>
                  {days === null ? 'sem contato' : `${days}d`}
                </div>
              </div>
            ))}
            {alerts.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6', padding: 8 }}>Nenhum alerta no momento.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Funil({ clients, updateClient, openClient }) {
  const [dragId, setDragId] = useState(null);
  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Funil Comercial</div>
          <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Arraste os cartões entre as etapas para atualizar o estágio da negociação</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 }}>
        {STAGES.map(stage => {
          const items = clients.filter(c => c.etapa === stage.key);
          return (
            <div key={stage.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragId != null) updateClient(dragId, { etapa: stage.key }); setDragId(null); }}
              style={{ minWidth: 250, flexShrink: 0, background: '#F0F1F3', borderRadius: 12, padding: 10, maxHeight: '72vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 10px' }}>
                <span className="font-mono" style={{ fontSize: 10, color: stage.color, fontWeight: 700, background: '#fff', padding: '2px 6px', borderRadius: 4 }}>{stage.icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{stage.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8C93A6', fontWeight: 600 }}>{items.length}</span>
              </div>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 }}>
                {items.map(c => (
                  <div key={c.id} draggable onDragStart={() => setDragId(c.id)} onClick={() => openClient(c.id)}
                    className="card-hover"
                    style={{ background: '#fff', borderRadius: 9, padding: 10, cursor: 'grab', borderLeft: `3px solid ${stage.color}`, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 2 }}>{c.empresa}</div>
                    <div style={{ fontSize: 11, color: '#8C93A6', marginBottom: 6 }}>{c.segmento || 'Sem segmento'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10.5, color: '#5B6472' }}>{c.contato || '—'}</span>
                      <span style={{ fontSize: 10, color: '#8C93A6' }} className="font-mono">{c.vendedor}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 11, color: '#B4B9C2', textAlign: 'center', padding: 16 }}>Vazio</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClienteLista({ clients, openClient, filterStatus, setFilterStatus, filterSegmento, setFilterSegmento, segmentos, total }) {
  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Clientes</div>
          <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>{clients.length} de {total} empresas</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
            {['Todos','Ativo','Prospect','Perdido','Recuperado'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterSegmento} onChange={e => setFilterSegmento(e.target.value)} style={selStyle}>
            {segmentos.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.2fr 1fr 1fr 1fr', padding: '10px 18px', fontSize: 11, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', letterSpacing: 0.3, borderBottom: '1px solid #ECEDF0' }}>
          <div>Empresa</div><div>Segmento</div><div>Contato</div><div>Vendedor</div><div>Etapa</div><div>Status</div>
        </div>
        <div style={{ maxHeight: '62vh', overflowY: 'auto' }}>
          {clients.map(c => {
            const stg = stageOf(c.etapa);
            return (
              <div key={c.id} onClick={() => openClient(c.id)}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1.2fr 1fr 1fr 1fr', padding: '11px 18px', fontSize: 12.5, borderBottom: '1px solid #F5F6F8', cursor: 'pointer', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ fontWeight: 700 }}>{c.empresa}</div>
                <div style={{ color: '#5B6472' }}>{c.segmento || '—'}</div>
                <div style={{ color: '#5B6472' }}>{c.contato || '—'}</div>
                <div style={{ color: '#5B6472' }} className="font-mono">{c.vendedor}</div>
                <div><span style={{ fontSize: 10.5, fontWeight: 700, color: stg.color, background: stg.color+'18', padding: '3px 8px', borderRadius: 20 }}>{stg.label}</span></div>
                <div><span style={{ fontSize: 10.5, fontWeight: 700, color: STATUS_COLOR[c.status], background: (STATUS_COLOR[c.status]||'#888')+'18', padding: '3px 8px', borderRadius: 20 }}>{c.status}</span></div>
              </div>
            );
          })}
          {clients.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: '#8C93A6', fontSize: 13 }}>Nenhuma empresa encontrada com esse filtro.</div>}
        </div>
      </div>
    </div>
  );
}

const selStyle = { padding: '7px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12.5, background: '#fff', color: '#101828' };

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>{label}</div>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={2}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5, resize: 'vertical' }} />
      ) : (
        <input value={value || ''} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', padding: '7px 9px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5 }} />
      )}
    </div>
  );
}

function ClienteDetalhe({ client, updateClient, addTimelineEntry, setView }) {
  const [novaNota, setNovaNota] = useState('');
  const stg = stageOf(client.etapa);
  const sortedTimeline = [...client.timeline].sort((a,b) => (b.data||'').localeCompare(a.data||''));
  const stageIdx = STAGES.findIndex(s => s.key === client.etapa);

  return (
    <div>
      <button onClick={() => setView('clientes')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#2E5EAA', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', marginBottom: 14, padding: 0 }}>
        <ArrowLeft size={14} /> Voltar para clientes
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{client.empresa}</div>
          <div style={{ fontSize: 12.5, color: '#8C93A6', marginTop: 3 }} className="font-mono">{client.cnpj || 'CNPJ não informado'} · {client.segmento}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={client.status} onChange={e => updateClient(client.id, { status: e.target.value })} style={{ ...selStyle, fontWeight: 700, color: STATUS_COLOR[client.status] }}>
            {['Ativo','Prospect','Perdido','Recuperado'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ROUTE / STAGE TRACKER — signature element */}
      <div style={{ background: '#101828', borderRadius: 12, padding: '18px 22px', marginBottom: 18, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 720 }}>
          {STAGES.filter(s => s.key !== 'Perdido').map((s, i, arr) => {
            const active = i <= stageIdx && client.etapa !== 'Perdido';
            const current = s.key === client.etapa;
            return (
              <React.Fragment key={s.key}>
                <div onClick={() => updateClient(client.id, { etapa: s.key })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0, width: 96 }}>
                  <div style={{
                    width: current ? 30 : 22, height: current ? 30 : 22, borderRadius: '50%',
                    background: active ? s.color : '#2B3648', border: current ? '3px solid #fff' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                    boxShadow: current ? `0 0 0 4px ${s.color}44` : 'none'
                  }}>
                    {current && <Truck size={13} color="#101828" />}
                  </div>
                  <div style={{ fontSize: 10, color: active ? '#fff' : '#5B6472', marginTop: 6, textAlign: 'center', fontWeight: current ? 700 : 500 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: i < stageIdx ? s.color : '#2B3648', minWidth: 20, marginTop: -18 }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* FICHA */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={15}/> Ficha da Empresa</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="Razão Social" value={client.razaoSocial} onChange={v => updateClient(client.id,{razaoSocial:v})} />
            <Field label="Nome Fantasia" value={client.nomeFantasia} onChange={v => updateClient(client.id,{nomeFantasia:v})} />
            <Field label="CNPJ" value={client.cnpj} onChange={v => updateClient(client.id,{cnpj:v})} />
            <Field label="Segmento" value={client.segmento} onChange={v => updateClient(client.id,{segmento:v})} />
            <Field label="Cidade" value={client.cidade} onChange={v => updateClient(client.id,{cidade:v})} />
            <Field label="Estado" value={client.estado} onChange={v => updateClient(client.id,{estado:v})} />
            <Field label="Contato principal" value={client.contato} onChange={v => updateClient(client.id,{contato:v})} />
            <Field label="Telefone / WhatsApp" value={client.telefone} onChange={v => updateClient(client.id,{telefone:v})} />
            <Field label="E-mail" value={client.email} onChange={v => updateClient(client.id,{email:v})} />
            <Field label="Vendedor responsável" value={client.vendedor} onChange={v => updateClient(client.id,{vendedor:v})} />
            <Field label="Modal utilizado" value={client.modal} onChange={v => updateClient(client.id,{modal:v})} />
            <Field label="Transportadora atual" value={client.transportadoraAtual} onChange={v => updateClient(client.id,{transportadoraAtual:v})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Principais dores / necessidade" value={client.necessidade} onChange={v => updateClient(client.id,{necessidade:v})} type="textarea" />
            <Field label="Objeções levantadas" value={client.objecoes} onChange={v => updateClient(client.id,{objecoes:v})} type="textarea" />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#8C93A6', textTransform: 'uppercase', marginBottom: 6 }}>Probabilidade de fechamento: {client.probabilidade}%</div>
            <input type="range" min={0} max={100} value={client.probabilidade} onChange={e => updateClient(client.id,{probabilidade: Number(e.target.value)})} style={{ width: '100%' }} />
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20, display: 'flex', flexDirection: 'column', maxHeight: 640 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15}/> Histórico de Interações</div>
          <div style={{ fontSize: 11.5, color: '#8C93A6', marginBottom: 12 }}>{client.timeline.length} registros</div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <input value={novaNota} onChange={e => setNovaNota(e.target.value)} placeholder="Registrar visita, ligação, e-mail, proposta..."
              style={{ flex: 1, padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E7EB', fontSize: 12.5 }}
              onKeyDown={e => { if (e.key === 'Enter' && novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }} />
            <button onClick={() => { if (novaNota.trim()) { addTimelineEntry(client.id, novaNota); setNovaNota(''); } }}
              style={{ background: '#101828', color: '#fff', border: 'none', borderRadius: 7, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Plus size={15} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, position: 'relative', paddingLeft: 14, borderLeft: '2px solid #ECEDF0' }}>
            {sortedTimeline.map((t, i) => (
              <div key={i} style={{ marginBottom: 16, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -19, top: 2, width: 8, height: 8, borderRadius: '50%', background: '#2E5EAA' }} />
                <div className="font-mono" style={{ fontSize: 10.5, color: '#8C93A6', fontWeight: 600 }}>{fmtDate(t.data)}</div>
                <div style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.45 }}>{t.nota}</div>
              </div>
            ))}
            {sortedTimeline.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Nenhum registro ainda.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUp({ alerts, openClient, clients }) {
  const semContato15 = clients.filter(c => {
    const d = daysSince(lastContactDate(c));
    return c.status !== 'Perdido' && d !== null && d >= 15 && d < 30;
  });
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Follow-up & Alertas</div>
        <div style={{ fontSize: 13, color: '#8C93A6', marginTop: 2 }}>Empresas que precisam de ação para não esfriar a negociação</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#B0463C' }}>
            <AlertTriangle size={16} /> Sem contato há 30+ dias ({alerts.length})
          </div>
          {alerts.map(({c, days}) => (
            <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.empresa}</div>
                <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.contato} · {c.vendedor}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#B0463C', alignSelf: 'center' }}>{days === null ? 'nunca contatado' : `${days} dias`}</div>
            </div>
          ))}
          {alerts.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Tudo em dia.</div>}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #ECEDF0', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#E8871E' }}>
            <Clock size={16} /> Atenção: 15–29 dias sem contato ({semContato15.length})
          </div>
          {semContato15.map(c => {
            const days = daysSince(lastContactDate(c));
            return (
              <div key={c.id} onClick={() => openClient(c.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 4px', borderBottom: '1px solid #F5F6F8', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.empresa}</div>
                  <div style={{ fontSize: 11, color: '#8C93A6' }}>{c.contato} · {c.vendedor}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E8871E', alignSelf: 'center' }}>{days} dias</div>
              </div>
            );
          })}
          {semContato15.length === 0 && <div style={{ fontSize: 12, color: '#8C93A6' }}>Nenhum caso no momento.</div>}
        </div>
      </div>
    </div>
  );
}
