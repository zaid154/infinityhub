export const SPEC_PRESETS = {
  laptop: [
    { key: 'processor', label: 'Processor', placeholder: 'e.g. Intel Core i5 8th Gen Quad-Core', value: '' },
    { key: 'ram', label: 'RAM Capacity', placeholder: 'e.g. 16GB DDR4 High-Speed', value: '' },
    { key: 'storage', label: 'Storage Drive', placeholder: 'e.g. 512GB M.2 NVMe PCIe SSD', value: '' },
    { key: 'screen_size', label: 'Display Screen / Resolution', placeholder: 'e.g. 14.0 inch Full HD IPS Anti-Glare', value: '' },
    { key: 'gpu_model', label: 'GPU / Graphics Card', placeholder: 'e.g. Intel UHD 620 / NVIDIA RTX 3060 12GB', value: '' },
    { key: 'operating_system', label: 'Operating System', placeholder: 'e.g. Windows 11 Pro Genuine', value: 'Windows 11 Pro' },
    { key: 'battery_health', label: 'Battery Backup / Health', placeholder: 'e.g. 85%+ Health (4-6 Hours Backup)', value: '' },
    { key: 'weight', label: 'Chassis Weight / Build', placeholder: 'e.g. 1.35 kg Ultra-Light Magnesium', value: '' }
  ],
  monitor: [
    { key: 'screen_size', label: 'Screen Size & Aspect Ratio', placeholder: 'e.g. 27-inch 16:9 Borderless', value: '' },
    { key: 'resolution', label: 'Resolution', placeholder: 'e.g. 2560 x 1440 QHD / 4K UHD', value: '' },
    { key: 'panel_type', label: 'Panel Type & Color Gamut', placeholder: 'e.g. IPS Panel, 99% sRGB Anti-Glare', value: '' },
    { key: 'refresh_rate', label: 'Refresh Rate & Response Time', placeholder: 'e.g. 144Hz / 1ms MPRT FreeSync', value: '' },
    { key: 'ports', label: 'Video Ports & Hub', placeholder: 'e.g. 2x HDMI 2.0, 1x DP 1.4, USB-C 65W PD', value: '' },
    { key: 'ergonomics', label: 'Stand & Mount Ergonomics', placeholder: 'e.g. Height Adjustable, Pivot, Swivel, VESA 100x100', value: '' }
  ],
  charger: [
    { key: 'wattage', label: 'Output Wattage', placeholder: 'e.g. 65W / 90W / 135W Fast Charge', value: '' },
    { key: 'connector_type', label: 'Connector Pin Type', placeholder: 'e.g. Type-C PD / Lenovo Slim Tip / Dell 4.5mm Barrel', value: '' },
    { key: 'voltage', label: 'Input Voltage & Frequency', placeholder: 'e.g. 100-240V ~ 1.5A 50-60Hz Universal', value: '' },
    { key: 'compatibility', label: 'Compatible Laptop Series', placeholder: 'e.g. ThinkPad T480/T490/X1, HP EliteBook 840', value: '' },
    { key: 'protection', label: 'Safety Protection Suite', placeholder: 'e.g. BIS Certified, Surge, Thermal & Over-Voltage Protection', value: '' }
  ],
  desktop: [
    { key: 'form_factor', label: 'Form Factor / Chassis', placeholder: 'e.g. Tiny Mini-PC / SFF / Mini Tower', value: '' },
    { key: 'processor', label: 'Processor', placeholder: 'e.g. Intel Core i7 10th Gen 8-Core', value: '' },
    { key: 'ram', label: 'RAM Capacity', placeholder: 'e.g. 32GB DDR4 High-Speed Dual Channel', value: '' },
    { key: 'storage', label: 'Storage Drive', placeholder: 'e.g. 1TB NVMe PCIe Gen3 SSD', value: '' },
    { key: 'gpu_model', label: 'Graphics Card / GPU', placeholder: 'e.g. Intel UHD 630 / Dedicated Quadro P620', value: '' },
    { key: 'operating_system', label: 'Operating System', placeholder: 'e.g. Windows 11 Pro Enterprise', value: 'Windows 11 Pro' },
    { key: 'power_supply', label: 'Power Supply (PSU)', placeholder: 'e.g. 260W 80 PLUS Platinum High Efficiency', value: '' }
  ],
  ram: [
    { key: 'ram', label: 'RAM Capacity', placeholder: 'e.g. 16GB Single Module / 32GB Kit', value: '' },
    { key: 'technology', label: 'Memory Technology', placeholder: 'e.g. DDR4 SDRAM / DDR5', value: '' },
    { key: 'form_factor', label: 'Form Factor', placeholder: 'e.g. SODIMM (Laptop) / UDIMM (Desktop)', value: '' },
    { key: 'speed', label: 'Bus Speed', placeholder: 'e.g. 3200MHz / 2666MHz PC4-25600', value: '' },
    { key: 'voltage', label: 'Operating Voltage', placeholder: 'e.g. 1.2V Low Voltage Standard', value: '' }
  ],
  gpu: [
    { key: 'vram', label: 'VRAM Capacity & Type', placeholder: 'e.g. 12GB GDDR6 Dedicated', value: '' },
    { key: 'cuda_cores', label: 'CUDA Cores / Compute Units', placeholder: 'e.g. 3584 CUDA Cores', value: '' },
    { key: 'bus_interface', label: 'Bus Interface', placeholder: 'e.g. PCI Express 4.0 x16', value: '' },
    { key: 'outputs', label: 'Display Output Ports', placeholder: 'e.g. 3x DisplayPort 1.4a, 1x HDMI 2.1', value: '' },
    { key: 'power_requirement', label: 'TDP / Power Requirement', placeholder: 'e.g. 170W TDP (1x 8-Pin PCIe Power)', value: '' }
  ],
  cpu: [
    { key: 'cores_threads', label: 'Cores & Threads', placeholder: 'e.g. 8 Cores / 16 Threads', value: '' },
    { key: 'clock_speed', label: 'Base & Boost Clock', placeholder: 'e.g. 3.80 GHz Base / 5.10 GHz Max Boost', value: '' },
    { key: 'socket', label: 'Socket Compatibility', placeholder: 'e.g. LGA 1200 / Socket AM4', value: '' },
    { key: 'cache', label: 'Cache Memory', placeholder: 'e.g. 16MB Intel Smart Cache', value: '' },
    { key: 'integrated_gpu', label: 'Integrated Graphics', placeholder: 'e.g. Intel UHD Graphics 630', value: '' }
  ],
  other: [
    { key: 'item_type', label: 'Accessory / Device Type', placeholder: 'e.g. Thunderbolt 4 Docking Station', value: '' },
    { key: 'compatibility', label: 'Compatible Hardware', placeholder: 'e.g. Universal USB-C / Thunderbolt 3 & 4', value: '' },
    { key: 'connectivity', label: 'Connectivity & Ports', placeholder: 'e.g. Dual 4K HDMI, Gigabit Ethernet, 3x USB 3.0', value: '' },
    { key: 'warranty', label: 'Warranty & Testing', placeholder: 'e.g. 90 Days Replacement Warranty, 100% Tested', value: '' }
  ]
};

export const PRESET_OPTIONS = [
  { key: 'laptop', label: 'Laptop', icon: '💻' },
  { key: 'monitor', label: 'Monitor', icon: '🖥️' },
  { key: 'charger', label: 'Charger / Adapter', icon: '⚡' },
  { key: 'desktop', label: 'Desktop / Mini PC', icon: '🖲️' },
  { key: 'ram', label: 'RAM Module', icon: '💾' },
  { key: 'gpu', label: 'Workstation GPU', icon: '🎮' },
  { key: 'cpu', label: 'CPU Processor', icon: '⚙️' },
  { key: 'other', label: 'Accessories', icon: '📦' }
];

export const formatSpecLabel = (k) => {
  if (!k) return '';
  const labelMap = {
    processor: 'Processor',
    ram: 'RAM Capacity',
    storage: 'Storage Drive',
    screen_size: 'Display Screen / Resolution',
    gpu_model: 'GPU / Graphics Card',
    operating_system: 'Operating System',
    battery_health: 'Battery Backup / Health',
    weight: 'Chassis Weight / Build',
    resolution: 'Resolution',
    panel_type: 'Panel Type & Color Gamut',
    refresh_rate: 'Refresh Rate & Response Time',
    ports: 'Video Ports & Hub',
    ergonomics: 'Stand & Mount Ergonomics',
    wattage: 'Output Wattage',
    connector_type: 'Connector Pin Type',
    voltage: 'Input Voltage & Frequency',
    compatibility: 'Compatible Laptop Series',
    protection: 'Safety Protection Suite',
    form_factor: 'Form Factor / Chassis',
    power_supply: 'Power Supply (PSU)',
    technology: 'Memory Technology',
    speed: 'Bus Speed',
    vram: 'VRAM Capacity & Type',
    cuda_cores: 'CUDA Cores / Compute Units',
    bus_interface: 'Bus Interface',
    outputs: 'Display Output Ports',
    power_requirement: 'TDP / Power Requirement',
    cores_threads: 'Cores & Threads',
    clock_speed: 'Base & Boost Clock',
    socket: 'Socket Compatibility',
    cache: 'Cache Memory',
    integrated_gpu: 'Integrated Graphics',
    item_type: 'Accessory / Device Type',
    connectivity: 'Connectivity & Ports',
    warranty: 'Warranty & Testing'
  };
  if (labelMap[k]) return labelMap[k];
  return k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};
