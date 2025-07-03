// Modified script.js (public/script.js) - CONNECTING TO BACKEND
document.addEventListener('DOMContentLoaded', function() {
    let radarChart; // Declare radarChart outside the fetch scope
    // Function to update progress bars
    function updateVitals(data) {
        const hpBar = document.querySelector('.hp-bar');
        const moodBar = document.querySelector('.mood-bar');
        const focusBar = document.querySelector('.focus-bar');
        const hpText = document.querySelector('.hp-bar + .bar-text');
        const moodText = document.querySelector('.mood-bar + .bar-text');
        const focusText = document.querySelector('.focus-bar + .bar-text');

        hpBar.style.width = `${data.hp}%`;
        moodBar.style.width = `${data.mood}%`;
        focusBar.style.width = `${data.focus}%`;
        hpText.textContent = `${data.hp}/100`;
        moodText.textContent = `${data.mood}/100`;
        focusText.textContent = `${data.focus}/100`;
    }

    function updateExp(data) {
        const expProgress = document.querySelector('.exp-progress');
        expProgress.style.width = `${data.exp}%`;
    }


    // Function to update chart
    function updateRadarChart(stats) {
        if (radarChart) {
            radarChart.data.datasets[0].data = Object.values(stats);
            radarChart.update();
        } else {
            const radarCtx = document.getElementById('radarChart').getContext('2d');
            radarChart = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ['Intelligence', 'Physical', 'Spiritual', 'Core', 'Psyche'],
                    datasets: [{
                        label: 'Attributes',
                        data: Object.values(stats),
                        backgroundColor: 'rgba(148, 103, 253, 0.2)',
                        borderColor: 'rgba(148, 103, 253, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(148, 103, 253, 1)',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(148, 103, 253, 1)',
                        pointHoverBorderColor: '#fff',
                        pointHitRadius: 10,
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                            pointLabels: {
                                color: 'white',
                                font: {
                                    family: 'Ubuntu Mono'
                                }
                            },
                            ticks: {
                                backdropColor: 'transparent',
                                color: 'rgba(255, 255, 255, 0.5)',
                                showLabelBackdrop: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    elements: {
                        line: {
                            tension: 0.1
                        }
                    }
                }
            });
        }
    }

    // Function to update quests
    function updateQuests(quests) {
        const questList = document.querySelector('.quest-list');
        questList.innerHTML = ''; // Clear existing quests

        quests.forEach(quest => {
            const questItem = document.createElement('div');
            questItem.classList.add('quest-item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = quest.id;
            checkbox.classList.add('quest-checkbox');
            checkbox.checked = quest.completed;

            const label = document.createElement('label');
            label.htmlFor = quest.id;
            label.textContent = quest.text;

            questItem.appendChild(checkbox);
            questItem.appendChild(label);
            questList.appendChild(questItem);

            // Apply initial style based on completion status
            if (quest.completed) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.7';
            }

             checkbox.addEventListener('change', async function() {
                const isChecked = this.checked;
                label.style.textDecoration = isChecked ? 'line-through' : 'none';
                label.style.opacity = isChecked ? '0.7' : '1';

                 try {
                    const response = await fetch('/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'quest',
                            questId: quest.id,
                            completed: isChecked,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update quest status');
                    }
                } catch (error) {
                    console.error('Error updating quest:', error);
                    // Revert checkbox state if update fails
                    checkbox.checked = !isChecked;
                    label.style.textDecoration = !isChecked ? 'line-through' : 'none';
                    label.style.opacity = !isChecked ? '0.7' : '1';
                }
            });
        });

    }

    // Fetch Data from Backend
    async function fetchData() {
        try {
            const response = await fetch('/progress');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Update the UI elements with fetched data
            updateVitals(data);
            updateRadarChart(data.stats);
            updateQuests(data.quests);
            updateExp(data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Console input functionality
    const commandInput = document.querySelector('.command-input');
    const consoleOutput = document.querySelector('.console-output');

    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            if (command) {
                // Add command to console
                addConsoleLine(`> ${command}`);

                // Process command (simple example)
                processCommand(command);

                // Clear input
                commandInput.value = '';
            }
        }
    });

    function addConsoleLine(text) {
        const p = document.createElement('p');
        p.textContent = text;
        consoleOutput.appendChild(p);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    async function processCommand(command) {
        const cmd = command.toLowerCase();
        let response = "Command not recognized. Type 'help' for available commands.";

        if (cmd === 'help') {
            response = "Available commands: stats, quests, heal, meditate, clear";
        } else if (cmd === 'stats') {
             try {
                const response = await fetch('/progress');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                response = `Current stats: HP ${data.hp}/100 | Mood ${data.mood}/100 | Focus ${data.focus}/100 | Level ${data.level}`;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else if (cmd === 'quests') {
             try {
                const response = await fetch('/progress');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const completedQuests = data.quests.filter(quest => quest.completed).length;
                response = `Active quests: ${data.quests.length} daily quests (${completedQuests} completed)`;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        else if (cmd === 'heal') {
             try {
                 const response = await fetch('/progress');
                 if (!response.ok) {
                     throw new Error('Network response was not ok');
                 }
                 const data = await response.json();

                 let newHp = Math.min(100, data.hp + 15);

                 const updateResponse = await fetch('/update', {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                         type: 'vital',
                         vitalName: 'hp',
                         vitalValue: newHp,
                     }),
                 });

                 if (!updateResponse.ok) {
                     throw new Error('Failed to update HP');
                 }

                 response = "Using healing potion... HP +15";
                 fetchData()
             } catch (error) {
                 console.error('Error fetching data:', error);
             }

        } else if (cmd === 'meditate') {

            try {
                const response = await fetch('/progress');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                let newFocus = Math.min(100, data.focus + 10);

                const updateResponse = await fetch('/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'vital',
                        vitalName: 'focus',
                        vitalValue: newFocus,
                    }),
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to update focus');
                }

                response = "Meditation session started. Focus +10, Mana recovery boosted.";
                fetchData();
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        } else if (cmd === 'clear') {
            consoleOutput.innerHTML = '';
            return;
        }

        addConsoleLine(response);
    }

    // Add some dynamic glow effects
    const neonElements = document.querySelectorAll('.neon-text, .neon-cyan, .neon-purple, .neon-yellow');
    neonElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s infinite';
        });
        el.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });

    fetchData();
});