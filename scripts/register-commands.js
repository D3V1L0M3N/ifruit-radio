// easily register slash commands on Discord

require('dotenv').config();

const inquirer = require('inquirer');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');



async function main() {

	let answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'isGlobal',
			message: 'Select scope of Slash Command',
			choices: [
				{
					value: true,
					name: "Global",
				},
				{
					value: false,
					name: 'Guild-Only',
				}
			]
		},
		{
			type: 'input',
			name: 'applicationId',
			message: 'Enter the Application ID',
		},
	]);

	if (!answers.isGlobal) {
		answers = {...answers, ...await inquirer.prompt([
			{
				type: 'input',
				name: 'guildId',
				message: 'Enter the Guild ID',
			}
		])}
	}

	const confirm = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: 'Is this OK?'
		}
	]).then(answers => (answers.confirm));

	if (!confirm) {
		return console.log('Operation cancelled');
	}

	console.log('\nRegistering commands..');
	


	// build a list of commands
	const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map(file => {

		const command = require(`../commands/${file}`);

		const slashCommand = new SlashCommandBuilder()
			.setName(command.name)
			.setDescription(command.description)

		return slashCommand;

	}).map(command => command.toJSON());



	// create new REST request
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

	try {
		if (answers.isGlobal) {
			await rest.put(Routes.applicationCommands(answers.applicationId), { body: commands } )
		}
		else {
			await rest.put(Routes.applicationGuildCommands(answers.applicationId, answers.guildId), { body: commands })
		}
	} catch(err) {
		console.log('An error occured while registering commands:');
		return console.error(err);
	}


	console.log(`Successfully registered ${commands.length} ${answers.isGlobal ? 'Global' : 'Guild-Only'} commands!`);
}



main();