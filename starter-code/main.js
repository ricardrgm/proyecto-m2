import clear from 'clear';
import { config } from './config.js';
import Database from './database.js';
import Questions from './questions.js';

const db = new Database(config.mongo);
const questions = new Questions();

const mainMenu = () => {
	clear();
	questions.showMainMenu();
	questions.typeAnOption(async (option) => {
		switch (option) {
			case "1":
				usersMenu();
				break;
			case "2":
				productMenu();
				break;
			case "3":
				buyProduct();
				break;
			case "4":
				writeReview();
				break;
			case "0":
				console.log(`Bye\n`);
				await db.close();
					process.exit(0);

				break;
			default:
				mainMenu();
				break;
		}
	})
}

// Users
const usersMenu = () => {
	clear();
	questions.showUserMenu();
	questions.typeAnOption((option) => {
		switch (option) {
			case "1":
				insertUser();
				break;
			case "2":
				listUsers();
				break;
			case "3":
				deleteUser();
				break;
			case "0":
				mainMenu();
				break;
			default:
				usersMenu();
				break;
		}
	})
}

const insertUser = () => {
	questions.askingInsertUser(async (user) => {
		try {

			const result = await db.insertUser(user);
			console.log('Inserted: ', result);

		} catch (error) {

			console.log(error);

		} finally {
			questions.continue(() => {
				usersMenu();
			});

		}
	})
}

const listUsers = async () => {
	try {
		const users = await db.listUsers();
		console.log('List of users: ');
		users.forEach((user) => {
			console.dir(user);
		});

	} catch (error) {
		console.log(error);
	} finally {
		questions.continue(() => {
			usersMenu();
		});
	}
}

const deleteUser = () => {
	questions.askingForDeleteUser(async (userName) => {
		try {

			const result = await db.deleteUser(userName);
			console.log(result);
			console.log('Deleted: ', result);

		} catch (error) {

			console.log(error);

		} finally {
			questions.continue(() => {
				usersMenu();
			});

		}
	})


}

// Products
const productMenu = () => {
	clear();
	questions.showProductMenu();
	questions.typeAnOption((option) => {
		switch (option) {
			case "1":
				insertProduct();
				break;
			case "2":
				listProducts();
				break;
			case "3":
				deleteProduct();
				break;
			case "0":
				mainMenu();
				break;
			default:
				productMenu();
				break;
		}
	})
}

const insertProduct = () => {
	questions.askingInsertProduct(async (product) => {
		try {
			const result = await db.insertProduct(product);
			console.log('Inserted: ', result);
		} catch (error) {
			console.log(error);
		}
		finally {
			questions.continue(() => {
				productMenu();
			});
		}
	});
}

const listProducts = async () => {
	try {
		const products = await db.listProducts();
		console.log('List of products: ');
		products.forEach((product) => {
			console.dir(product);
		});
	} catch (error) {
		console.log(error);
	}
	finally {
		questions.continue(() => {
			productMenu();
		});
	}

}

const deleteProduct = () => {
	questions.askingForDeleteProduct(async (name) => {
		try {
			const result = await db.deleteProduct(name);
			console.log('Deleted: ', result);
		} catch (error) {
			console.log(error);
		} finally {
			questions.continue(() => {
				productMenu();
			});
		}
	})
}

const buyProduct = () => {
	questions.askingBuyProduct(async (userFirstName, productName) => {
		try {
			await db.addProductToShoppingCart({ userFirstName, productName });
			console.log('Thanks for your purchase!!');
		} catch (error) {
			console.log(error);
		} finally {
			questions.continue(() => {
				mainMenu();
			});
		}
	})
}


const writeReview = () => {
	questions.askingWriteReview(async (productName, review) => {
		try {
			await db.addReviewToProduct({ productName, review });
		} catch (error) {
			console.log(error);
		} finally {
			questions.continue(() => {
				mainMenu();
			});
		}
	})
}


mainMenu();