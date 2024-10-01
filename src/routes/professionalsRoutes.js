const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

var professionalsDB = loadProfessionals();

// Função para carregar os profissionais
function loadProfessionals() {
    try {
        const db = JSON.parse(fs.readFileSync('./src/db/db.json', 'utf8'));
        return db.professionals || [];
    } catch (err) {
        return "Banco não encontrado";
    }
}

// Função para salvar os profissionais
function saveProfessionals() {
    try {
        let db = JSON.parse(fs.readFileSync('./src/db/db.json', 'utf8'));
        db.professionals = professionalsDB;
        fs.writeFileSync('./src/db/db.json', JSON.stringify(db, null, 2));
        return "Saved";
    } catch (err) {
        return "Not saved";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - speciality
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do profissional
 *         name:
 *           type: string
 *           description: Nome do Profissional
 *         speciality:
 *           type: string
 *           description: Especialidade do Profissional
 *         contact:
 *           type: string
 *           description: Contato do Profissional
 *         phone_number:
 *           type: string
 *           description: Número de telefone do Profissional
 *         status:
 *           type: string
 *           description: Status do Profissional (on/off)
 *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         name: Andre Faria Ruaro
 *         speciality: Fisioterapeuta
 *         contact: andre.faria@gmail
 *         phone_number: 48 9696 5858
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: API de Controle de Profissionais
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 */

// GET "/professionals"
router.get('/', (req, res) => {
    console.log("getroute");
    professionalsDB = loadProfessionals();
    res.json(professionalsDB);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

// GET "/professionals/:id"
router.get('/:id', (req, res) => {
    const id = req.params.id;
    professionalsDB = loadProfessionals();
    const professional = professionalsDB.find((prof) => prof.id === id);
    if (!professional) return res.status(404).json({ "erro": "Profissional não encontrado!" });
    res.json(professional);
});

/**
 * @swagger
 * /professionals/search/name:
 *   get:
 *     summary: Pesquisa profissionais pelo nome
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do profissional a ser pesquisado
 *     responses:
 *       200:
 *         description: Lista de profissionais correspondentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Nenhum profissional encontrado
 */
router.get('/search/name', (req, res) => {
    const nome = req.query.nome;
  
    // Verifica se o nome foi fornecido
    if (!nome) {
      return res.status(400).json({ erro: "O parâmetro 'nome' é obrigatório para a pesquisa!" });
    }
  
    professionalsDB = loadProfessionals();
  
    // Filtrar profissionais cujo nome contém o termo buscado (case insensitive)
    const result = professionalsDB.filter(professional =>
      professional.name.toLowerCase().includes(nome.toLowerCase())
    );
  
    if (result.length === 0) {
      return res.status(404).json({ erro: "Nenhum profissional encontrado com esse nome!" });
    }
  
    res.json(result);
  });
  
/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 */

// POST "/professionals" BODY { "name": "Eragon", "speciality": "Fisioterapeuta", "contact": "eragon@gmail.com", "phone_number": "123456789", "status": "on" }
router.post('/', (req, res) => {
    const newProfessional = {
        id: uuidv4(),
        ...req.body
    };
    console.log(newProfessional);
    professionalsDB = loadProfessionals();
    professionalsDB.push(newProfessional);
    let result = saveProfessionals();
    console.log(result);
    return res.json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *  put:
 *    summary: Atualiza um profissional pelo ID
 *    tags: [Professionals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do profissional
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Professional'
 *    responses:
 *      200:
 *        description: O profissional foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *      404:
 *        description: Profissional não encontrado
 */

// PUT "/professionals/:id" BODY { "name": "Eragon", "speciality": "Fisioterapeuta", "contact": "eragon@gmail.com", "phone_number": "123456789", "status": "on" }
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newProfessional = req.body;
    professionalsDB = loadProfessionals();
    const currentProfessional = professionalsDB.find((prof) => prof.id === id);
    const currentIndex = professionalsDB.findIndex((prof) => prof.id === id);
    if (!currentProfessional)
        return res.status(404).json({ "erro": "Profissional não encontrado!" });
    professionalsDB[currentIndex] = { ...currentProfessional, ...newProfessional };
    let result = saveProfessionals();
    console.log(result);
    return res.json(professionalsDB[currentIndex]);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Professional'
 *       404:
 *         description: Profissional não encontrado
 */

// DELETE "/professionals/:id"
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    professionalsDB = loadProfessionals();
    const currentProfessional = professionalsDB.find((prof) => prof.id === id);
    const currentIndex = professionalsDB.findIndex((prof) => prof.id === id);
    if (!currentProfessional) return res.status(404).json({ "erro": "Profissional não encontrado!" });
    const deleted = professionalsDB.splice(currentIndex, 1);
    let result = saveProfessionals();
    console.log(result);
    res.json(deleted);
});

module.exports = router;
