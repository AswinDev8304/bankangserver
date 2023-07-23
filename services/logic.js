//import model
const db = require('./db')
//import webtoken:
const jwt = require('jsonwebtoken')

//register
register = (acno, psw, uname) => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: "user already present",
                status: false,
                statuscode: 404
            }
        }
        else {

            newuser = new db.User({
                acno: acno,
                uname: uname,
                psw: psw,
                balance: 0,
                transaction: []
            })
            //to make and save changes
            newuser.save()
            return {
                message: "user created sucessfully",
                status: true,
                statuscode: 200

            }

        }

    })
}
//login logic
login = (acno, psw) => {
    return db.User.findOne({ acno, psw }).then(user => {
        if (user) {
            const token = jwt.sign({ acno }, "bankkey123")
            return {
                message: "login success",
                status: true,
                statuscode: 200,
                currentUser: user.uname,
                currentAcno: user.acno,
                token
            }

        }
        else {
            return {
                message: "incorrect username or password",
                status: false,
                statuscode: 400
            }
        }
    }
    )
}

//to get user data
getUser = (acno) => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user,
                status: true,
                statuscode: 200
            }
        }
        else {
            return {
                message: "user do not exist",
                status: false,
                statuscode: 404
            }
        }
    })
}
//to get balance
getBalance = (acno) => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.balance,
                status: true,
                statuscode: 200
            }
        }
        else {
            return {
                message: "user do not exist",
                status: false,
                statuscode: 404
            }
        }
    })
}

//to transfer money
moneyTransfer = (fromAcno, toAcno, psw, date, amount) => {
    return db.User.findOne({ acno: fromAcno, psw }).then(fromUser => {
        if (fromUser) {
            return db.User.findOne({ acno: toAcno }).then(toUser => {
                if (toUser) {
                    amount = parseInt(amount)
                    if (amount > fromUser.balance) {
                        return {
                            message: 'insufficient balance',
                            status: false,
                            statuscode: 404
                        }
                    }
                    else {
                        fromUser.balance = fromUser.balance - amount
                        fromUser.transaction.push({ type: 'DEBIT', amount, date })
                        fromUser.save()

                        toUser.balance = toUser.balance + amount
                        toUser.transaction.push({ type: 'CREDIT', amount, date })
                        toUser.save()

                        return {
                            message: 'transaction completed',
                            status: true,
                            statuscode: 200
                        }
                    }
                }
                else {

                    return {
                        message: 'invalid credit credentials',
                        status: false,
                        statuscode: 404
                    }
                }
            })
        }
        else {

            return {
                message: 'invalid debit credentials',
                status: false,
                statuscode: 404
            }
        }
    })
}

getTransaction = acno => {
    return db.User.findOne({ acno }).then(user => {
        if (user) {
            return {
                message: user.transaction,
                status: true,
                statuscode: 200
            }
        }
        else {
            return {
                message: 'Invalid account number!',
                status: false,
                statuscode: 404
            }
        }
    })
}

//to delete:
deleteAc = acno => {
    return db.User.deleteOne({ acno }).then(result => {
        if (result) {
            return {
                message: "bank account deleted",
                status: true,
                statuscode: 200
            }
        }
        else {
            return {
                message: "account not present",
                status: false,
                statuscode: 400
            }

        }
    })
}

//to export reg function
module.exports = {
    register, login, getUser, getBalance, moneyTransfer, getTransaction, deleteAc
}