const title = 'What do you want the permit for?'

const items = [
  { text: 'Anaerobic digestion including storing digestate', value: 'anaerobic' },
  { text: 'Car and vehicle dismantling', value: 'car' },
  { text: 'Composting, sewage or sludge treatment, biogas', value: 'composting' },
  { text: 'Deposit for recovery', value: 'deposit' },
  { text: 'Electrical insulating oil storage', value: 'electrical' },
  { text: 'Flood risk activities', value: 'flood' },
  { text: 'Generators - Specified Generator, Tranche B', value: 'generators' },
  { text: 'Medium combustion plant - stationary and in operation after 20/12/2018', value: 'mcp' },
  { text: 'Metal recycling, scrap metal and WEEE - not cars or vehicles', value: 'metal' },
  { text: 'Mining, oil and gas', value: 'mining' },
  { text: 'Mobile plant for land-spreading or treatment', value: 'mobile' },
  { text: 'Radioactive substances for non-nuclear sites', value: 'radioactive' },
  { text: 'Storage or treatment of waste - recycling, dredgings, clinical, soil or wood treatment', value: 'storage' },
  { text: 'Waste transfer station or amenity site with or without treatment', value: 'waste' },
  { text: 'Water discharges', value: 'water' }
]

const permitCategory = {
  type: 'RadiosField',
  name: 'permitCategory',
  title: ' ',
  titleForError: 'Select what you want the permit for',
  options: {
    list: {
      type: 'string',
      items
    }
  }
}

const dontKnow = {
  type: 'Details',
  title: 'I cannot find the permit I need',
  content: `<p><a href="https://www.gov.uk/topic/environmental-management/environmental-permits">Read more about waste environmental permits on GOV.UK</a> or contact the Environment Agency.</p>
    <p>We are open Monday to Friday, 8am to 6pm.</p>

    <p>Email <a href="mailto:enquiries@environment-agency.gov.uk">enquiries@environment-agency.gov.uk</a><br>
    Telephone 03708 506 506<br>
    Telephone from outside the UK +44 (0) 114 282 5312<br>
    Minicom (for the hard of hearing) 03702 422 549</p>
  `
}

const components = [
  permitCategory,
  dontKnow
]

module.exports = { title, components }
