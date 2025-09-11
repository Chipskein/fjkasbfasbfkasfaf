const database = require('../config/db')
const { hash } = require('bcrypt')
const { convertToCSV } = require('../utils/csv')
const { getStSigla } = require('../utils/strings')
module.exports={

    async get(req,res){
        const search=req.query?.search || null
        const sort=req.query?.sort || null
        const status=req.query?.status || null
        const role=req.query?.role || null
        const limit = parseInt(req.query?.limit) || 10;
        const page = parseInt(req.query?.page) || 1;
        const offset = (page - 1) * limit;
        const totalUsers = database.users.length;
        let users = database.users.slice(offset, offset + limit);
        if (search){
            users = users.filter( u => 
                u.st_name.toLowerCase().includes(search.toLowerCase()) ||
                u.st_email.toLowerCase().includes(search.toLowerCase()) ||
                u.st_username.toLowerCase().includes(search.toLowerCase())
            )
        }
        if(role) users = users.filter( u => u.st_role.toLowerCase().includes(role.toLowerCase()))
        if(status) users = users.filter( u => u.st_status.toLowerCase().includes(status.toLowerCase()))
        if(sort){
            switch(sort.toLowerCase()){
                case "za":
                    users.sort((a, b) => b.st_name.localeCompare(a.st_name))
                    break
                
                case "az":
                    users.sort((a, b) => a.st_name.localeCompare(b.st_name))
                    break

                case "new":
                    users.sort((a,b)=>a.dt_created-b.dt_created)
                    break

                case "old":
                    users.sort((a,b)=>b.dt_created-a.dt_created)
                    break
            }
        }

        const totalPages = Math.ceil(totalUsers / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;
        const pageData={
            users,
            pagination:{
                totalUsers,
                totalPages,
                currentPage: page,
                limit,
                hasNext,
                hasPrevious,
                nextPage: page + 1,
                prevPage: page - 1
            }
        }
        return res.render("table",pageData)
    },

    async export(req,res){
        const { users } = database;
        const csv = convertToCSV(users);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="UsersDump${new Date().getTime()}.csv"`);
        return res.status(200).send(csv);
    },
    
    async renderSaveForm(req,res){
        const { user_id } = req.params
        let user = null
        if(user_id) user = database.users.find(u=>u.in_id == user_id)
        return res.render("user",{user})
    },

    async saveForm(req,res){
        try{
            const { user_id } = req.params
            const {
                st_name,
                st_email,
                st_password,
                st_confirm_password,
                st_role,
                st_status,
            } = req.body
            if(!st_name|| st_name.trim()=='') throw new Error("Nome invalido")
            if(!st_email|| st_email.trim()=='') throw new Error("Email invalido")
            if(st_password!==st_confirm_password) throw new Error("Senha não conferem")
            if(!['active','invited','suspended'].includes(st_status.toLowerCase())) throw new Error("Status inválido")
            if(!['manager','viewer','admin','editor'].includes(st_role.toLowerCase())) throw new Error("Role inválido")
            if(user_id){
                let index = database.users.findIndex(u=>u.in_id = user_id)
                let user  = database.users.find(u=>u.in_id = user_id)
                database.users[index]={
                    ...user,
                    st_name,
                    st_email,
                    st_password:await hash(st_password,10),
                    st_role: st_role?.toLowerCase(),
                    st_status: st_status?.toLowerCase(),
                    dt_updated:new Date().toISOString(),
                    st_sigla: st_name!==user.st_name ? getStSigla(st_name):user.st_sigla
                }
            } else{
                database.users.push({
                    in_id:database.users.length,
                    st_name,
                    st_email,
                    st_password:await hash(st_password,10),
                    st_role,
                    st_status,
                    st_username:`@${st_name.toLowerCase()}`,
                    st_sigla:getStSigla(st_name),
                    dt_created:new Date().toISOString(),
                    dt_updated:new Date().toISOString(),
                })
            }

            return res.redirect("/users/")
        }
        catch(err){
            return res.redirect(`/users?error=${err?.message}`)
        }
    },

    async deleteUser(req,res){
        const { user_id } = req.params
        let index = database.users.findIndex(u=>u.in_id == user_id)
        const foundUser=index!==-1
        if(foundUser) database.users.splice(index,1)
        return res.redirect('/users')
    }
    
}