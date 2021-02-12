import React, { Component } from 'react'

export class Quote extends Component {
  componentDidMount(){
    setInterval(() => {
      const { mainStore } = this.props;
      console.log(mainStore)
    }, 8000);
  }
  render() {
    return (
      <div className="quoteWithinArticleContainer">
        <h4>On December 3rd, 2020 Joe Biden said: </h4>
        <div className="quoteWithinArticle">
          <p>"One year ago, our nation was devastated by a brutal act of hatred and murder against the Latino community in El Paso that stole 23 innocent lives and left 23 more injured.  <div className="quoteWithinArticleHighlight">...Today, our hearts remain broken, but our resolve to end the epidemic of gun violence and confront the scourge of racism, xenophobia and fear remains as strong as ever. Inspired by the courage and activism of the El Paso community as well as survivors, families and friends across the country, House Democrats have taken bold action to protect our communities.  Last year, House Democrats overwhelmingly passed H.R. 8, the Bipartisan Background Checks Act to ensure universal background checks.  ...</div>And to close the Charleston loophole that enabled the hate crime at Mother Emanuel AME Church, we passed H.R. 1112, the Enhanced Background Checks Act.  While we rededicate ourselves to advancing a drumbeat across America to force Leader McConnell to end his obstruction and allow a vote on these life-saving bills, we must also honor the victims of El Paso and countless others across the country by opposing hatred, bigotry and violence in all its forms. On this solemn occasion, we continue to grieve with all those impacted by the daily tragedy of gun violence saying ‘Enough is enough,’ and we stand strong with all those demanding an end to violence, injustice and bigotry wherever and whenever it is found.  Working together, we can keep our communities safe and build a brighter future for all."</p>
        </div>
      </div>
    )
  }
}

export default Quote
