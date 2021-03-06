import React from 'react'
import PropTypes from 'prop-types'

import {Panel} from 'primereact/panel'
import {InputMask} from 'primereact/inputmask'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Card} from 'primereact/card'

import servicos from '../servicos'
import util_masks from './util_masks'
import MostraProprietarios from './MostraProprietarios.jsx'

class PesquisaProprietario extends React.Component {

  constructor() {
    super()
    this.state = {
      cpfDefinido: false,
      cpf: undefined,
      proprietario: undefined
    }
  }

  pesquise(ev) {
    ev.preventDefault() // evita envio de requisição ao servidor

    const prom = servicos.pesquiseProprietario(this.state.cpf)
    prom
      .then((proprietario) => {
        if (proprietario !== null) {
          this.setState({proprietario})
          this.growl.show({
            severity: 'success',
            summary: 'Pesquisa por Proprietário',
            detail: 'Proprietário encontrado!'})
        } else {
          return Promise.reject(new Error(`Não existe proprietário com CPF ${this.state.cpf}`))
        }
      })
      .catch((erro) => {
        this.setState({proprietario: undefined})
        this.growl.show({
          severity: 'error',
          summary: 'Pesquisa por Proprietário',
          detail: erro.message})
      })
    this.setState({proprietario: undefined})
  }

  definiuCPF () {
    this.setState({cpfDefinido : true})
  }

  armazeneCPF (ev) {
    if (ev.value !== this.state.cpf) {
      this.setState({cpf: ev.value, cpfDefinido: false, proprietario: undefined})
    }
  }

  render() {
    let proprietario = null
    if (this.state.proprietario !== undefined)
      proprietario = <MostraProprietarios proprietarios={[this.state.proprietario]}/>

    return (
      <Panel header='Pesquisar Proprietário'>
        <Growl ref={(el) => {this.growl = el}}/>
        <Card>
          <form onSubmit={this.pesquise.bind(this)}>
            <p>
              CPF :
              <br/>
              <InputMask
                value={this.state.cpf}
                onComplete={this.definiuCPF.bind(this)}
                onChange={this.armazeneCPF.bind(this)}
                mask={util_masks.cpfMask}
                unmask={true}
                size={util_masks.cpfMask.length}/>
            </p>
          </form>
          <Button
            label='Pesquisar'
            className='p-button-success'
            type='submit'
            disabled={this.state.cpfDefinido === false}
            onClick={this.pesquise.bind(this)}/>

          <Button
            label='Cancelar'
            className='p-button-danger'
            onClick={this.props.cancelar}/>
        </Card>
        <div>{proprietario}</div>
      </Panel>
    )
  }
}

PesquisaProprietario.propTypes = {
  cancelar : PropTypes.func.isRequired
}

export default PesquisaProprietario
