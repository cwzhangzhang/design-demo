        const updateProgressUI = () => {
            // Update Global Status Label
            taskGlobalStatusLabel.classList.remove('hidden');
            let statusText = '待开始';
            let statusClass = 'bg-yellow-50 text-yellow-600 border-yellow-100';
            
            if (taskGlobalStatus === 'RUNNING') {
                statusText = '执行中';
                statusClass = 'bg-blue-50 text-blue-600 border-blue-100';
            } else if (taskGlobalStatus === 'SUCCESS') {
                statusText = '已成功';
                statusClass = 'bg-green-50 text-green-600 border-green-100';
            } else if (taskGlobalStatus === 'TERMINATED') {
                statusText = '终止';
                statusClass = 'bg-red-50 text-red-600 border-red-100';
            }
            taskGlobalStatusLabel.textContent = statusText;
            taskGlobalStatusLabel.className = `px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`;

            // Render Steps
            const stepContainer = document.getElementById('step-container');
            let stepsHtml = '';

            Object.keys(phaseMockData).forEach(key => {
                const step = parseInt(key);
                const data = phaseMockData[step];
                let cardClass = '';
                let iconHtml = '';
                let statusBadge = '';
                let activeBorder = '';
                
                // Determine State
                let isCompleted = false;
                let isActive = false;
                let isFailed = false;

                if (taskGlobalStatus === 'PENDING') {
                    // All pending
                    cardClass = 'bg-white hover:bg-gray-50';
                    iconHtml = `<div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold transition-colors">${step}</div>`;
                    statusBadge = `<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-bold">待执行</span>`;
                } else if (taskGlobalStatus === 'TERMINATED') {
                    if (step < currentStep) {
                        isCompleted = true;
                    } else if (step === currentStep) {
                        isFailed = true;
                    } else {
                        cardClass = 'bg-white opacity-40';
                        iconHtml = `<div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold transition-colors">${step}</div>`;
                        statusBadge = `<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-bold">待执行</span>`;
                    }
                } else {
                    // Running or Success
                    if (step < currentStep || (taskGlobalStatus === 'SUCCESS' && step === currentStep)) {
                        isCompleted = true;
                    } else if (step === currentStep) {
                        isActive = true;
                    } else {
                        cardClass = 'bg-white opacity-60';
                        iconHtml = `<div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold transition-colors">${step}</div>`;
                        statusBadge = `<span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-bold">待执行</span>`;
                    }
                }

                if (isCompleted) {
                    cardClass = 'bg-gray-50';
                    iconHtml = `<div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm transition-transform scale-105"><i data-lucide="check" class="w-3.5 h-3.5"></i></div>`;
                    statusBadge = `<span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">已完成</span>`;
                }

                if (isFailed) {
                    cardClass = 'bg-red-50';
                    iconHtml = `<div class="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm"><i data-lucide="x" class="w-3.5 h-3.5"></i></div>`;
                    statusBadge = `<span class="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full font-bold">失败</span>`;
                    activeBorder = `<div class="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>`;
                }

                if (isActive) {
                    cardClass = 'bg-white relative shadow-md z-10';
                    iconHtml = `<div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-blue-100">${step}</div>`;
                    statusBadge = `<span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-bold border border-blue-100">执行中</span>`;
                    activeBorder = `<div class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>`;
                }
                
                // Add click handler for selection
                const isSelected = step === selectedStep;
                const selectionClass = isSelected ? 'ring-2 ring-primary ring-inset bg-blue-50/30' : '';

                // Render Details
                stepsHtml += `
                <div class="p-4 flex flex-col gap-3 group transition-all cursor-pointer ${cardClass} ${selectionClass} step-item relative overflow-hidden" data-step="${step}">
                     <div class="flex items-center justify-between relative z-10">
                         <div class="flex items-center gap-2">
                             ${iconHtml}
                             ${statusBadge}
                         </div>
                     </div>
                     <div class="relative z-10">
                         <h4 class="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors">${data.name}</h4>
                     </div>
                     <div class="space-y-1.5 relative z-10">
                         <div class="flex items-center gap-2 text-xs text-gray-500">
                             <i data-lucide="pie-chart" class="w-3.5 h-3.5 text-gray-400"></i> 灰度 ${data.ratio}
                         </div>
                         <div class="flex items-center gap-2 text-xs text-gray-500">
                             <i data-lucide="server" class="w-3.5 h-3.5 text-gray-400"></i> ${data.count} 台机器
                         </div>
                         <div class="flex items-center gap-2 text-xs text-gray-500">
                             <i data-lucide="clock" class="w-3.5 h-3.5 text-gray-400"></i> 观测 ${data.obsDuration}s
                         </div>
                     </div>
                     ${activeBorder}
                </div>
                `;
            });

            stepContainer.innerHTML = stepsHtml;
            
            // Re-attach event listeners to new step items
            const newStepItems = stepContainer.querySelectorAll('.step-item');
            newStepItems.forEach(item => {
                item.addEventListener('click', () => {
                    selectedStep = parseInt(item.getAttribute('data-step'));
                    if (currentScope === 'current') {
                        currentPage = 1;
                    }
                    updateProgressUI();
                });
            });

            // Update Phase Control Panel
            const phaseControlPanel = document.getElementById('phase-control-panel');
            const data = phaseMockData[selectedStep];
            panelTitle.textContent = `${data.name} (${data.status})`;
            
            // Dynamic Panel Styling
            phaseControlPanel.className = 'rounded-xl border p-5 mb-8 transition-all duration-300 shadow-sm';
            if (taskGlobalStatus === 'RUNNING' && selectedStep === currentStep && data.status === '执行中') {
                 // Active Phase Styling (Banner Style)
                 phaseControlPanel.classList.add('bg-blue-50', 'border-blue-200');
            } else if (data.status === '已成功') {
                 phaseControlPanel.classList.add('bg-green-50', 'border-green-200');
            } else if (data.status === '失败') {
                 phaseControlPanel.classList.add('bg-red-50', 'border-red-200');
            } else {
                 phaseControlPanel.classList.add('bg-gray-50', 'border-gray-200');
            }

            // Update counts in panel
            const successCount = (data.reports || []).filter(r => r.status === 'SUCCESS').length;
            const alertCount = (data.alerts || []).length;
            panelSuccessCount.innerHTML = `${successCount} 正常`;
            panelAlertCount.innerHTML = `${alertCount} 告警`;
            
            // Control visibility of actions
            // Actions only visible if task is RUNNING, and we are viewing the current running step
            if (taskGlobalStatus === 'RUNNING' && selectedStep === currentStep && data.status === '执行中') {
                panelActions.classList.remove('hidden');
                
                // Only enable Success button if Observation is Done
                if (data.subStatus === 'done') {
                    btnSuccess.disabled = false;
                    btnSuccess.classList.remove('opacity-50', 'cursor-not-allowed');
                    btnSuccess.classList.add('animate-bounce'); // Add visual cue
                } else {
                    btnSuccess.disabled = true;
                    btnSuccess.classList.add('opacity-50', 'cursor-not-allowed');
                    btnSuccess.classList.remove('animate-bounce');
                }

                btnError.disabled = false;
                btnError.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                panelActions.classList.add('hidden');
            }

            renderExecutionReport(); 
            lucide.createIcons();
        };
